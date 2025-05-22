import React, { useEffect, useState } from "react";
import { Table, Button, InputGroup, Form, Card } from "react-bootstrap";
import { MdOutlineModeEdit } from "react-icons/md";
import { FaCheck, FaTimes } from "react-icons/fa";
import axios from "axios";
import "../styles/CustomTables.css";

/* ─────────── shared palette ─────────── */
const CARD_BG      = "#fff0e2";
const HEADER_COLOR = "#6b3503";
const TH_STYLE     = { background: "#e2eaff", color: "#264e70" };
const ID_BADGE     = { background: "#f3e6ff", color: "#872ff7" };
const PRICE_BADGE  = { background: "#fde9d7", color: "#de7015" };

/* types */
interface Product { product_id:number; name:string; price:number; }

export default function ProductPriceTable() {
  const [products,   setProducts] = useState<Product[]>([]);
  const [editingId,  setEditing]  = useState<number|null>(null);
  const [tempPrice,  setTemp]     = useState<Record<number,number>>({});

  /* fetch products (sorted) */
  useEffect(()=>{
    axios.get("/api/products")
      .then(res=>setProducts([...res.data].sort((a,b)=>a.product_id-b.product_id)))
      .catch(err=>console.error("Failed to fetch products:",err));
  },[]);

  /* helpers */
  const beginEdit = (p:Product)=>{
    setEditing(p.product_id);
    setTemp(t=>({ ...t, [p.product_id]: p.price }));
  };
  const cancel   = ()=>setEditing(null);
  const save     = async (p:Product)=>{
    const val=tempPrice[p.product_id];
    await axios.put(`/api/products/${p.product_id}`,{ price:val });
    setProducts(ps=>ps.map(x=>x.product_id===p.product_id?{...x,price:val}:x));
    setEditing(null);
  };

  /* render */
  return (
    <Card className="rounded-border" style={{ background:CARD_BG }}>
      <Card.Header as="h4" style={{ color:HEADER_COLOR, background:"transparent", borderBottom:"none" }}>
        Set Product Prices
      </Card.Header>

      <Card.Body>
        <Table
          bordered hover responsive
          className="custom-table"
          style={{ background:"#fff", borderCollapse:"separate", borderSpacing:"0 8px" }}
        >
          <thead><tr style={TH_STYLE}>
            <th className="text-center">ID</th><th className="text-center">Name</th>
            <th className="text-center">Price</th><th className="text-center">Actions</th>
          </tr></thead>

          <tbody>
            {products.map(p=>(
              <tr key={p.product_id} className="rounded-row">
                {/* ID */}
                <td className="text-center align-middle">
                  <span style={{ ...ID_BADGE, borderRadius:16, padding:"2px 12px" }}>{p.product_id}</span>
                </td>

                {/* Name */}
                <td className="text-center align-middle">{p.name}</td>

                {/* Price (edit / display) */}
                <td className="text-center align-middle">
                  {editingId===p.product_id ? (
                    <InputGroup size="sm" className="justify-content-center">
                      <Form.Control
                        type="number" min="0" step="0.01"
                        value={tempPrice[p.product_id]??""}
                        onChange={e=>setTemp(t=>({ ...t, [p.product_id]:Number(e.target.value) }))}
                        style={{ maxWidth:100, borderRadius:10, boxShadow:"none" }}
                        autoFocus
                      />
                      <InputGroup.Text className="bg-white border-0">$</InputGroup.Text>
                    </InputGroup>
                  ) : (
                    <span style={{ ...PRICE_BADGE, borderRadius:14, padding:"2px 18px" }}>
                      ${p.price.toFixed(2)}
                    </span>
                  )}
                </td>

                {/* Actions */}
                <td className="text-center align-middle">
                  {editingId===p.product_id ? (
                    <>
                      <Button variant="outline-success" size="sm" onClick={()=>save(p)}
                              className="me-2 rounded-circle border-0 shadow-sm d-inline-flex justify-content-center align-items-center"
                              style={{ width:32, height:32 }}><FaCheck size={16}/></Button>
                      <Button variant="outline-danger"  size="sm" onClick={cancel}
                              className="rounded-circle border-0 shadow-sm d-inline-flex justify-content-center align-items-center"
                              style={{ width:32, height:32 }}><FaTimes size={16}/></Button>
                    </>
                  ) : (
                    <Button variant="outline-warning" size="sm" onClick={()=>beginEdit(p)}
                            className="rounded-circle border-0 shadow-sm d-inline-flex justify-content-center align-items-center"
                            style={{ width:32, height:32 }}><MdOutlineModeEdit size={16} color="#e07018"/></Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
}