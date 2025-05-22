//  src/components/ProductPriceTable.tsx
import React, { useEffect, useState } from "react";
import { Table, Button, InputGroup, Form, Card } from "react-bootstrap";
import { MdOutlineModeEdit } from "react-icons/md";
import { FaCheck, FaTimes } from "react-icons/fa";
import axios from "axios";
import "../styles/CustomTables.css";

/* ─────────── shared pastel palette ─────────── */
const CARD_BG      = "#fff0e2";
const HEADER_COLOR = "#6b3503";
const TH_STYLE     = { background: "#e2eaff", color: "#264e70" };
const ID_BADGE     = { background: "#f3e6ff", color: "#872ff7" };
const MONEY_BADGE  = { background: "#fde9d7", color: "#de7015" };

/* ─────────── data types ─────────── */
interface Product {
  product_id: number;
  name:       string;
  price:      number;
  discount:   number;   // 0 – 1
}

/* ══════════════════════════════════════════════ */
export default function ProductPriceTable() {
  const [products,      setProducts]   = useState<Product[]>([]);
  const [editingId,     setEditing]    = useState<number|null>(null);
  const [tempPrice,     setTempPrice]  = useState<Record<number, number>>({});
  const [tempDiscount,  setTempDisc]   = useState<Record<number, number>>({});

  /* ───── fetch once ───── */
  useEffect(() => {
    axios.get<Product[]>("/api/products")
      .then(res =>
        setProducts([...res.data].sort((a, b) => a.product_id - b.product_id))
      )
      .catch(err => console.error("Failed to fetch products:", err));
  }, []);

  /* ───── helpers ───── */
  const beginEdit = (p: Product) => {
    setEditing(p.product_id);
    setTempPrice(t => ({ ...t,  [p.product_id]: p.price }));
    setTempDisc (d => ({ ...d,  [p.product_id]: p.discount * 100 })); // store % for UI
  };

  const cancelEdit = () => setEditing(null);

  const save = async (p: Product) => {
    const newPrice    = tempPrice[p.product_id];
    const newDiscount = (tempDiscount[p.product_id] ?? 0) / 100; // back to 0-1

    try {
      /* update price if changed */
      if (newPrice !== p.price) {
        await axios.put(`/api/products/${p.product_id}`, { price: newPrice });
      }

      /* update discount if changed */
      if (Math.abs(newDiscount - p.discount) > 1e-6) {
        await axios.patch(`/api/products/${p.product_id}/discount`, {
          discount: newDiscount,
        });
      }

      /* reflect locally */
      setProducts(ps =>
        ps.map(x =>
          x.product_id === p.product_id
            ? { ...x, price: newPrice, discount: newDiscount }
            : x
        )
      );
      setEditing(null);
    } catch (err) {
      alert("Failed to update product");
      console.error(err);
    }
  };

  /* ───── render ───── */
  return (
    <Card className="rounded-border" style={{ background: CARD_BG }}>
      <Card.Header
        as="h4"
        style={{ color: HEADER_COLOR, background: "transparent", borderBottom: "none" }}
      >
        Set Product Prices &amp; Discounts
      </Card.Header>

      <Card.Body>
        <Table
          bordered
          hover
          responsive
          className="custom-table"
          style={{ background: "#fff", borderCollapse: "separate", borderSpacing: "0 8px" }}
        >
          <thead>
            <tr style={TH_STYLE}>
              <th className="text-center">ID</th>
              <th className="text-center">Name</th>
              <th className="text-center">Price</th>
              <th className="text-center">Discount&nbsp;(%)</th>
              <th className="text-center">Discounted&nbsp;Price</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map(p => {
              const discPct   = (p.discount * 100).toFixed(0);
              const final     = p.price * (1 - p.discount);
              const inEdit    = editingId === p.product_id;

              return (
                <tr key={p.product_id} className="rounded-row" style={{ background: "#f9f9f9" }}>
                  {/* ID */}
                  <td className="text-center align-middle">
                    <span style={{ ...ID_BADGE, borderRadius: 16, padding: "2px 12px" }}>
                      {p.product_id}
                    </span>
                  </td>

                  {/* Name */}
                  <td className="text-center align-middle">{p.name}</td>

                  {/* Price */}
                  <td className="text-center align-middle">
                    {inEdit ? (
                      <InputGroup size="sm" className="justify-content-center">
                        <Form.Control
                          type="number"
                          min="0"
                          step="0.01"
                          value={tempPrice[p.product_id] ?? ""}
                          onChange={e =>
                            setTempPrice(t => ({
                              ...t,
                              [p.product_id]: Number(e.target.value),
                            }))
                          }
                          style={{ maxWidth: 100, borderRadius: 10, boxShadow: "none" }}
                          autoFocus
                        />
                        <InputGroup.Text className="bg-white border-0">$</InputGroup.Text>
                      </InputGroup>
                    ) : (
                      <span style={{ ...MONEY_BADGE, borderRadius: 14, padding: "2px 18px" }}>
                        ${p.price.toFixed(2)}
                      </span>
                    )}
                  </td>

                  {/* Discount */}
                  <td className="text-center align-middle">
                    {inEdit ? (
                      <InputGroup size="sm" className="justify-content-center">
                        <Form.Control
                          type="number"
                          min="0"
                          max="100"
                          step="1"
                          value={tempDiscount[p.product_id] ?? ""}
                          onChange={e =>
                            setTempDisc(d => ({
                              ...d,
                              [p.product_id]: Number(e.target.value),
                            }))
                          }
                          style={{ maxWidth: 80, borderRadius: 10, boxShadow: "none" }}
                        />
                        <InputGroup.Text className="bg-white border-0">%</InputGroup.Text>
                      </InputGroup>
                    ) : (
                      `${discPct}%`
                    )}
                  </td>

                  {/* Discounted price */}
                  <td className="text-center align-middle">
                    <span style={{ ...MONEY_BADGE, borderRadius: 14, padding: "2px 18px" }}>
                      ${(final).toFixed(2)}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="text-center align-middle">
                    {inEdit ? (
                      <>
                        <Button
                          variant="outline-success"
                          size="sm"
                          onClick={() => save(p)}
                          className="me-2 rounded-circle border-0 shadow-sm d-inline-flex justify-content-center align-items-center"
                          style={{ width: 32, height: 32 }}
                        >
                          <FaCheck size={16} />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={cancelEdit}
                          className="rounded-circle border-0 shadow-sm d-inline-flex justify-content-center align-items-center"
                          style={{ width: 32, height: 32 }}
                        >
                          <FaTimes size={16} />
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="outline-warning"
                        size="sm"
                        onClick={() => beginEdit(p)}
                        className="rounded-circle border-0 shadow-sm d-inline-flex justify-content-center align-items-center"
                        style={{ width: 32, height: 32 }}
                      >
                        <MdOutlineModeEdit size={16} color="#e07018" />
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
}