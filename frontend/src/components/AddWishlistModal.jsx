import React, { useState } from 'react';
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

const TextArea = styled.textarea`
   padding: var(--spacing-sm);
   border: 1px solid #ccc;
   border-radius: var(--border-radius);
   font-size: 1rem;
   width: 100%;
   min-height: 80px;
   resize: vertical;
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

function AddWishlistModal({ isOpen, onClose, onCreate }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
        alert("Wishlist name is required.");
        return;
    }
    onCreate(name.trim(), description.trim());
    setName('');
    setDescription('');
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>×</CloseButton>
        <ModalTitle>Create New Wishlist</ModalTitle>
        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Wishlist Name (Required)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <TextArea
            placeholder="Description (Optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Button type="submit">Create Wishlist</Button>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
}

export default AddWishlistModal;