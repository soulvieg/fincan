import React, { useEffect, useState } from "react";
import { Table, Button, InputGroup, Form, Card } from "react-bootstrap";
import { MdOutlineModeEdit } from "react-icons/md";
import { FaCheck, FaTimes } from "react-icons/fa";
import axios from "axios";

interface Product {
  id: number;
  name: string;
  price: number;
}

const ProductPriceTable: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [tempPrice, setTempPrice] = useState<number>(0);

  useEffect(() => {
    axios.get("http://localhost:5001/api/products") // your products endpoint
      .then(res => setProducts(res.data))
      .catch(err => console.error("Failed to fetch products", err));
  }, []);

  const handleEditClick = (product: Product) => {
    setEditingId(product.id);
    setTempPrice(product.price);
  };

  const handleCancel = () => {
    setEditingId(null);
    setTempPrice(0);
  };

  const handleSave = async (product: Product) => {
    try {
      await axios.put(`http://localhost:5001/api/products/${product.id}`, {
        price: tempPrice
      });
      setProducts(p =>
        p.map(prd =>
          prd.id === product.id ? { ...prd, price: tempPrice } : prd
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
              <th className="text-center align-middle">ID</th>
              <th className="text-center align-middle">Name</th>
              <th className="text-center align-middle">Price</th>
              <th className="text-center align-middle">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td className="text-center align-middle">{product.id}</td>
                <td className="text-center align-middle">{product.name}</td>
                <td className="text-center align-middle">
                  {editingId === product.id ? (
                    <InputGroup>
                      <Form.Control
                        type="number"
                        min="0"
                        value={tempPrice}
                        onChange={e => setTempPrice(Number(e.target.value))}
                        style={{ maxWidth: 120 }}
                      />
                    </InputGroup>
                  ) : (
                    `$${product.price.toFixed(2)}`
                  )}
                </td>
                <td className="text-center align-middle">
                  {editingId === product.id ? (
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
                    <Button variant="outline-warning" size="sm" onClick={() => handleEditClick(product)}>
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
