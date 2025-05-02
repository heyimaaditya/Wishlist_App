import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const CardWrapper = styled.div`
    background: #fff;
    padding: var(--spacing-md);
    border-radius: var(--border-radius);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.08);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
    min-height: 120px;
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
`;

const CardLink = styled(Link)`
    text-decoration: none;
    color: inherit;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
    flex-grow: 1;
`;

const CardTitle = styled.h3`
  margin: 0;
  color: var(--color-primary);
  font-size: 1.2rem;
`;

const CardDescription = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  flex-grow: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: var(--spacing-sm);
  justify-content: flex-end;
`;

const ActionButton = styled.button`
   padding: 5px 10px;
   border: none;
   border-radius: var(--border-radius);
   font-size: 0.8rem;
   cursor: pointer;
   transition: background-color 0.2s ease;
   color: white;
   background-color: var(--color-danger);

   &:hover {
     background-color: #c82333;
   }
`;


function WishlistCard({ wishlist, onDelete, isOwner }) {
  if (!wishlist || !wishlist.id) {
    return null;
  }

  return (
    <CardWrapper>
        <CardLink to={`/wishlists/${wishlist.id}`}>
            <CardTitle>{wishlist.name}</CardTitle>
            {wishlist.description && <CardDescription>{wishlist.description}</CardDescription>}
        </CardLink>
         {isOwner && (
             <ActionsContainer>
                 <ActionButton onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(); }}>Delete</ActionButton>
             </ActionsContainer>
         )}
    </CardWrapper>
  );
}

export default WishlistCard;