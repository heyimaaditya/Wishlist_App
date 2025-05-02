import React from 'react';
import styled from 'styled-components';

const ItemCard = styled.div`
  background: #fff;
  padding: var(--spacing-md);
  border-radius: var(--border-radius);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  flex-wrap: wrap;
`;

const ProductImage = styled.img`
   width: 60px;
   height: 60px;
   object-fit: cover;
   border-radius: var(--border-radius);
   background-color: #eee;
   flex-shrink: 0;
`;

const ProductDetails = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  min-width: 150px;
`;

const ProductName = styled.h4`
  margin: 0 0 var(--spacing-sm) 0;
  color: var(--color-dark);
  font-size: 1rem;
`;

const ProductPrice = styled.span`
  font-weight: bold;
  color: var(--color-success);
  margin-bottom: var(--spacing-sm);
`;

const AddedBy = styled.span`
   font-size: 0.8rem;
   color: var(--color-text-muted);
`;

const Actions = styled.div`
   display: flex;
   gap: var(--spacing-sm);
   margin-left: auto;
   @media (max-width: 400px) {
        margin-left: 0;
        width: 100%;
        justify-content: flex-end;
   }
`;

const ActionButton = styled.button`
   padding: 5px 10px;
   border: none;
   border-radius: var(--border-radius);
   cursor: pointer;
   font-size: 0.9rem;
   transition: background-color 0.2s ease;
   color: white;


   &.edit {
      background-color: var(--color-warning);
      color: var(--color-dark);
      &:hover { background-color: #e0a800; }
   }

   &.delete {
      background-color: var(--color-danger);
      color: white;
      &:hover { background-color: #c82333; }
   }
`;

function ProductItem({ product, isOwner, onDelete, onEdit }) {
  if (!product) {
    return null;
  }

  return (
    <ItemCard>
        {product.imageUrl && <ProductImage src={product.imageUrl} alt={product.name} />}
        <ProductDetails>
            <ProductName>{product.name}</ProductName>
            <ProductPrice>${product.price?.toFixed(2) || 'N/A'}</ProductPrice>
            <AddedBy>Added by: {product.addedByEmail || product.addedBy || 'Unknown'}</AddedBy>
        </ProductDetails>
         {isOwner && (
             <Actions>
                 <ActionButton className="edit" onClick={onEdit}>Edit</ActionButton>
                 <ActionButton className="delete" onClick={onDelete}>Delete</ActionButton>
             </Actions>
         )}
    </ItemCard>
  );
}

export default ProductItem;