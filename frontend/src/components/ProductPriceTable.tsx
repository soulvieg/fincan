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
    <Card className="shadow-sm rounded-4 mt-4 border-0" style={{ background: "#ADD8E6" }}>
      <Card.Header as="h4" className="py-3 px-4 border-0 bg-transparent" style={{ color: '#00000' }}>
         Set Product Prices
      </Card.Header>

      <Card.Body className="py-4 px-4">
        <Table bordered responsive hover className="rounded-3 overflow-hidden mb-0" style={{ background: "#fff" }}>
          <thead>
            <tr style={{ background: "#ffe7ba", color: "#aa7722" }}>
              <th className="text-center align-middle">ID</th>
              <th className="text-center align-middle">Name</th>
              <th className="text-center align-middle">Price</th>
              <th className="text-center align-middle">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.product_id} className={editingId === product.product_id ? "table-warning" : ""}>
                <td className="text-center align-middle">
                  <span style={{
                    background: '#f3e6ff',
                    color: '#872ff7',
                    borderRadius: '16px',
                    padding: '2px 12px',
                    fontSize: '0.98rem'
                  }}>
                    {product.product_id}
                  </span>
                </td>
                <td className="align-middle text-center">{product.name}</td>
                <td className="text-center align-middle">
                  {editingId === product.product_id ? (
                    <InputGroup size="sm" className="justify-content-center">
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
                        style={{ maxWidth: 100, borderRadius: 10, border: "1px solid #eacbbf", boxShadow: "none" }}
                        autoFocus
                      />
                      <InputGroup.Text className="bg-white border-0" style={{ color: "#e88f13" }}>
                        $
                      </InputGroup.Text>
                    </InputGroup>
                  ) : (
                    <span style={{
                      background: '#fde9d7',
                      color: '#de7015',
                      borderRadius: '14px',
                      padding: '2px 18px',
                      fontSize: '1.01rem'
                    }}>
                      ${product.price.toFixed(2)}
                    </span>
                  )}
                </td>
                <td className="text-center align-middle">
                  {editingId === product.product_id ? (
                    <>
                      <Button
                        variant="outline-success"
                        size="sm"
                        onClick={() => handleSave(product)}
                        className="me-2 px-2 py-1 rounded-circle border-0 shadow-sm d-inline-flex justify-content-center align-items-center"
                        style={{ width: 32, height: 32 }}
                      >
                        <FaCheck size={16} />
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={handleCancel}
                        className="px-2 py-1 rounded-circle border-0 shadow-sm d-inline-flex justify-content-center align-items-center"
                        style={{ width: 32, height: 32 }}
                      >
                        <FaTimes size={16} />
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outline-warning"
                      size="sm"
                      onClick={() => handleEditClick(product)}
                      className="rounded-circle border-0 shadow-sm px-2 py-1 d-inline-flex justify-content-center align-items-center"
                      style={{ width: 32, height: 32 }}
                    >
                      <MdOutlineModeEdit size={16} color="#e07018" />
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
