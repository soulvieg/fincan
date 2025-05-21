import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

interface ImageUrlModalProps {
  show: boolean;
  initialUrl: string;
  onSave: (url: string) => void;
  onHide: () => void;
}

const ImageUrlModal: React.FC<ImageUrlModalProps> = ({
  show,
  initialUrl,
  onSave,
  onHide,
}) => {
  const [url, setUrl] = useState(initialUrl);

  useEffect(() => {
    setUrl(initialUrl);
  }, [initialUrl]);

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Set Product Image URL</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group controlId="formImageUrl">
          <Form.Label>Image URL</Form.Label>
          <Form.Control
            type="text"
            placeholder="https://..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={() => onSave(url)}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ImageUrlModal;