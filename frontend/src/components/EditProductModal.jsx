import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: var(--spacing-lg);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  width: 90%;
  max-width: 400px;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
`;

const CloseButton = styled.button`
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-sm);
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--color-text-muted);

  &:hover {
    color: var(--color-dark);
  }
`;

const ModalTitle = styled.h2`
  margin-top: 0;
  margin-bottom: var(--spacing-md);
  text-align: center;
  color: var(--color-dark);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
`;

const Input = styled.input`
  padding: var(--spacing-sm);
  border: 1px solid #ccc;
  border-radius: var(--border-radius);
  font-size: 1rem;
  width: 100%;
`;

const Button = styled.button`
  padding: var(--spacing-sm);
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;


function EditProductModal({ isOpen, onClose, product, onUpdate }) {
  const [name, setName] = useState(product?.name || '');
  const [price, setPrice] = useState(product?.price?.toString() || '');
  const [imageUrl, setImageUrl] = useState(product?.imageUrl || '');

  useEffect(() => {
      // Update state when the 'product' prop changes
      if (product) {
          setName(product.name || '');
          setPrice(product.price?.toString() || '');
          setImageUrl(product.imageUrl || '');
      } else {
          setName('');
          setPrice('');
          setImageUrl('');
      }
  }, [product]);


  if (!isOpen || !product) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim() || price.trim() === '') {
        alert("Product name and price are required.");
        return;
    }
    const priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue < 0) {
         alert("Price must be a valid positive number.");
         return;
    }

    onUpdate(product.id, {
        name: name.trim(),
        price: priceValue,
        imageUrl: imageUrl.trim(),
    });
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>×</CloseButton>
        <ModalTitle>Edit Product</ModalTitle>
        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Product Name (Required)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            type="text"
            placeholder="Price (Required)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
          <Input
            type="url"
            placeholder="Image URL (Optional)"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
          <Button type="submit">Save Changes</Button>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
}

export default EditProductModal;