import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { getWishlists, createWishlist, deleteWishlist } from '../api/api';
import WishlistCard from '../components/WishlistCard';
import AddWishlistModal from '../components/AddWishlistModal';

const Container = styled.div`
  padding: var(--spacing-lg);
  max-width: 1200px;
  margin: var(--spacing-md) auto;
`;

const Title = styled.h1`
  color: var(--color-dark);
  margin-bottom: var(--spacing-lg);
`;

const WishlistGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-md);
`;

const AddButton = styled.button`
   padding: var(--spacing-sm) var(--spacing-md);
   background-color: var(--color-success);
   color: white;
   border: none;
   border-radius: var(--border-radius);
   font-size: 1rem;
   cursor: pointer;
   margin-bottom: var(--spacing-lg);
   transition: background-color 0.3s ease;

   &:hover {
     background-color: #218838;
   }
`;

const Message = styled.p`
    text-align: center;
    color: var(--color-text-secondary);
    font-size: 1.1rem;
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-sm);
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


function HomePage() {
  const { currentUser, getIdToken } = useAuth();
  const [wishlists, setWishlists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchWishlists = async () => {
    setLoading(true);
    setError(null);
    try {
       const token = await getIdToken();
       if (!token) {
           setError("Authentication token not available. Please log in.");
           setLoading(false);
           return;
       }
       const data = await getWishlists(token);
       setWishlists(data);
    } catch (err) {
      console.error("Failed to fetch wishlists:", err);
      setError("Failed to load wishlists. " + (err.message || "Please try again."));
      setWishlists([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchWishlists();
    } else {
        setLoading(false);
        setWishlists([]);
    }
  }, [currentUser, getIdToken]);

  const handleCreateWishlist = async (name, description) => {
      setIsModalOpen(false);
      try {
           const token = await getIdToken();
           if (!token) {
              alert("Authentication token not available.");
              return;
           }
          const newWishlist = await createWishlist({ name, description }, token);
          setWishlists([...wishlists, newWishlist]);
      } catch(err) {
          console.error("Failed to create wishlist:", err);
          alert("Failed to create wishlist: " + (err.message || "Unknown error."));
      }
  };

   const handleDeleteWishlist = async (wishlistId) => {
       if (!window.confirm("Are you sure you want to delete this wishlist? This cannot be undone.")) {
           return;
       }
       try {
           const token = await getIdToken();
           if (!token) {
               alert("Authentication token not available.");
               return;
           }
           await deleteWishlist(wishlistId, token);
         
           setWishlists(wishlists.filter(list => list.id !== wishlistId));
           alert("Wishlist deleted successfully.");
       } catch (err) {
            console.error("Failed to delete wishlist:", err);
            alert("Failed to delete wishlist: " + (err.message || "Unknown error."));
       }
   };


  if (loading) return <Container><Message>Loading wishlists...</Message></Container>;
  if (error) return <Container><Message style={{ color: 'var(--color-danger)' }}>Error: {error}</Message></Container>;
  if (!currentUser) return <Container><Message>Please log in to view wishlists.</Message></Container>;

  return (
    <Container>
      <Title>Your Wishlists</Title>

      <AddButton onClick={() => setIsModalOpen(true)}>Create New Wishlist</AddButton>

      <WishlistGrid>
        {wishlists.length === 0 ? (
            <Message>No wishlists found. Click "Create New Wishlist" to get started!</Message>
        ) : (
            wishlists.map(wishlist => (
                <WishlistCard
                    key={wishlist.id}
                    wishlist={wishlist}
                    onDelete={() => handleDeleteWishlist(wishlist.id)}
                    isOwner={wishlist.ownerId === currentUser?.uid}
                 />
            ))
        )}
      </WishlistGrid>

      <AddWishlistModal
         isOpen={isModalOpen}
         onClose={() => setIsModalOpen(false)}
         onCreate={handleCreateWishlist}
      />
    </Container>
  );
}

export default HomePage;