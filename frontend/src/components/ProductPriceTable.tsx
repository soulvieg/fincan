import React, { useEffect, useState } from "react";
import { Table, Button, InputGroup, Form, Card } from "react-bootstrap";
import { MdOutlineModeEdit } from "react-icons/md";
import { FaCheck, FaTimes } from "react-icons/fa";
import axios from "axios";

interface Product {
  product_id: number;
  name: string;
  price: number;
}

const ProductPriceTable: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [tempPrices, setTempPrices] = useState<Record<number, number>>({});

  useEffect(() => {
    axios.get("http://localhost:5001/api/products")
      .then(res => {
        const data = res.data;

        // Check for duplicate product_id values
        const seen = new Set();
        const duplicates = data.filter((item: Product) => {
          if (seen.has(item.product_id)) return true;
          seen.add(item.product_id);
          return false;
        });

        if (duplicates.length > 0) {
          console.warn("⚠️ Duplicate product IDs found:", duplicates);
        } else {
          console.log("✅ No duplicate IDs. Products fetched:", data);
        }

        setProducts(data);
      })
      .catch(err => console.error("Failed to fetch products", err));
  }, []);

  const handleEditClick = (product: Product) => {
    setEditingId(product.product_id);
    setTempPrices(prev => ({ ...prev, [product.product_id]: product.price }));
  };

  const handleCancel = () => {
    setEditingId(null);
    setTempPrices(prev => {
      const { [editingId!]: _, ...rest } = prev;
      return rest;
    });
  };

  const handleSave = async (product: Product) => {
    const updatedPrice = tempPrices[product.product_id];

    try {
      await axios.put(`http://localhost:5001/api/products/${product.product_id}`, {
        price: updatedPrice
      });
      setProducts(p =>
        p.map(prd =>
          prd.product_id === product.product_id ? { ...prd, price: updatedPrice } : prd
        )
      );
      setEditingId(null);
    } catch (err) {
      alert("Failed to update price");
    }
  };

  return (
    <Card className="rounded-border mt-4" style={{ backgroundColor: "#f5e9da" }}>
      <Card.Header as="h4" style={{ borderBottom: "none", backgroundColor: "transparent" }}>
        Set Product Prices
      </Card.Header>
      <Card.Body>
        <Table bordered hover className="custom-table">
          <thead>
            <tr className="rounded-row header-row">
              <th className="text-center align-middle">Product ID</th>
              <th className="text-center align-middle">Name</th>
              <th className="text-center align-middle">Price</th>
              <th className="text-center align-middle">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.product_id}>
                <td className="text-center align-middle">{product.product_id}</td>
                <td className="text-center align-middle">{product.name}</td>
                <td className="text-center align-middle">
                  {editingId === product.product_id ? (
                    <InputGroup>
                      <Form.Control
                        type="number"
                        min="0"
                        value={tempPrices[product.product_id] ?? ""}
                        onChange={e =>
                          setTempPrices(prev => ({
                            ...prev,
                            [product.product_id]: Number(e.target.value)
                          }))
                        }
                        style={{ maxWidth: 120 }}
                      />
                    </InputGroup>
                  ) : (
                    `$${product.price.toFixed(2)}`
                  )}
                </td>
                <td className="text-center align-middle">
                  {editingId === product.product_id ? (
                    <>
                      <Button
                        variant="outline-success"
                        size="sm"
                        onClick={() => handleSave(product)}
                        style={{ marginRight: 5 }}
                      >
                        <FaCheck />
                      </Button>
                      <Button variant="outline-danger" size="sm" onClick={handleCancel}>
                        <FaTimes />
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outline-warning"
                      size="sm"
                      onClick={() => handleEditClick(product)}
                    >
                      <MdOutlineModeEdit size={16} />
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default ProductPriceTable;
