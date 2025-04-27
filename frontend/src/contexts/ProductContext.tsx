import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";

export type Product = {
  product_id:        number;
  category_id:       number;
  sku:               string;
  name:              string;
  model:             string;
  serial_number:     string;
  description:       string;
  quantity_in_stock: number;
  price:             number;
  warranty_status:   string;
  distributor_info:  string;
  image_url:         string;
  is_best_seller:    boolean;
  rating:            number | null;
};

export type Category = {
  category_id: number;
  name:        string;
};

interface ProductContextType {
  products:                 Product[];
  categories:               Category[];                   // now Category[]
  loading:                  boolean;
  error:                    string | null;
  getBestSellers:           () => Product[];
  updateRating:             (id: number, newRating: number) => void;
  checkStock:               (id: number) => Promise<number>;
  updateStockAfterPurchase: (id: number, quantity: number) => Promise<boolean>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [products, setProducts]     = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading]       = useState<boolean>(true);
  const [error, setError]           = useState<string | null>(null);

  // configure axios once
  axios.defaults.baseURL = "http://localhost:5001";
  axios.defaults.withCredentials = true;

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // 1) fetch categories
        const catRes = await axios.get<Category[]>("/api/categories");
        // prepend "All" as id=0, "Best Sellers" as id=-1
        setCategories([
          { category_id: 0,  name: "All" },
          { category_id: -1, name: "Best Sellers" },
          ...catRes.data,
        ]);

        // 2) fetch products (with avg rating)
        const prodRes = await axios.get<Product[]>("/api/products");
        setProducts(prodRes.data);
      } catch (err: any) {
        console.error("ProductContext fetch error:", err);
        setError(err.message || "Failed to load products/categories");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const getBestSellers = () => products.filter((p) => p.is_best_seller);

  const updateRating = (id: number, newRating: number) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.product_id === id ? { ...p, rating: newRating } : p
      )
    );
  };

  const checkStock = async (id: number): Promise<number> => {
    try {
      const res = await axios.get<{ quantity_in_stock: number }>(
        `/api/products/${id}`
      );
      const stock = res.data.quantity_in_stock;
      setProducts((prev) =>
        prev.map((p) =>
          p.product_id === id ? { ...p, quantity_in_stock: stock } : p
        )
      );
      return stock;
    } catch (err) {
      console.error(`Error checking stock for ${id}:`, err);
      return 0;
    }
  };

  const updateStockAfterPurchase = async (
    id: number,
    quantity: number
  ): Promise<boolean> => {
    const existing = products.find((p) => p.product_id === id);
    if (!existing || existing.quantity_in_stock < quantity) return false;

    const newStock = existing.quantity_in_stock - quantity;
    try {
      await axios.put(`/api/products/${id}/quantity`, {
        newQuantity: newStock,
      });
      setProducts((prev) =>
        prev.map((p) =>
          p.product_id === id
            ? { ...p, quantity_in_stock: newStock }
            : p
        )
      );
      return true;
    } catch (err) {
      console.error(`Error updating stock for ${id}:`, err);
      return false;
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        categories,
        loading,
        error,
        getBestSellers,
        updateRating,
        checkStock,
        updateStockAfterPurchase,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = (): ProductContextType => {
  const ctx = useContext(ProductContext);
  if (!ctx) {
    throw new Error(
      "useProductContext must be used within a ProductProvider"
    );
  }
  return ctx;
};