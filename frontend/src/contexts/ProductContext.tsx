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
  category:          string;
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

type ProductContextType = {
  products:        Product[];
  categories:      string[];
  getBestSellers:  () => Product[];
  updateRating:    (id: number, newRating: number) => void;
};

const ProductContext = createContext<ProductContextType | undefined>(
  undefined
);

export const ProductProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [products, setProducts]     = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    // 1) Fetch categories list
    axios
      .get<{ category_id: number; name: string }[]>("/api/categories")
      .then((res) => {
        const names = res.data.map((c) => c.name);
        setCategories(["All", "Best Sellers", ...names]);
      })
      .catch(console.error);

    // 2) Fetch products (with rating)
    axios
      .get<Product[]>("/api/products")
      .then((res) => setProducts(res.data))
      .catch(console.error);
  }, []);

  const getBestSellers = () =>
    products.filter((p) => p.is_best_seller);

  const updateRating = (id: number, newRating: number) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.product_id === id ? { ...p, rating: newRating } : p
      )
    );
  };

  return (
    <ProductContext.Provider
      value={{ products, categories, getBestSellers, updateRating }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => {
  const ctx = useContext(ProductContext);
  if (!ctx)
    throw new Error(
      "useProductContext must be used within a ProductProvider"
    );
  return ctx;
};