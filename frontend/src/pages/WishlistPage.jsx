import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { getWishlistDetails, addProductToWishlist, updateProductInWishlist, deleteProductFromWishlist } from '../api/api';

import { database } from '../firebase';
import { ref, onValue, off } from 'firebase/database';

import ProductItem from '../components/ProductItem';
import AddProductModal from '../components/AddProductModal';
import EditProductModal from '../components/EditProductModal';


const Container = styled.div`
  padding: var(--spacing-lg);
  max-width: 1200px;
  margin: var(--spacing-md) auto;
`;

const Title = styled.h1`
  color: var(--color-dark);
  margin-bottom: var(--spacing-sm);
`;

const Description = styled.p`
   color: var(--color-text-secondary);
   margin-bottom: var(--spacing-lg);
`;

const ProductList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
`;

const AddButton = styled.button`
   padding: var(--spacing-sm) var(--spacing-md);
   background-color: var(--color-primary);
   color: white;
   border: none;
   border-radius: var(--border-radius);
   font-size: 1rem;
   cursor: pointer;
   margin-bottom: var(--spacing-lg);
   align-self: flex-start;
   transition: background-color 0.3s ease;

   &:hover {
     background-color: #0056b3;
   }
`;

const Message = styled.p`
    text-align: center;
    color: var(--color-text-secondary);
    font-size: 1.1rem;
    margin-top: var(--spacing-lg);
`;

function WishlistPage() {
  const { wishlistId } = useParams();
  const { currentUser, getIdToken } = useAuth();
  const [wishlist, setWishlist] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);


  useEffect(() => {
     if (!wishlistId) return;

     const productsRef = ref(database, `wishlists/${wishlistId}/products`);

     const unsubscribe = onValue(productsRef, (snapshot) => {
       const productsData = snapshot.val();
       console.log("RTDB products update:", productsData);
       if (productsData) {
         const productsArray = Object.keys(productsData).map(key => ({
             id: key,
             ...productsData[key]
         }));
         setProducts(productsArray);
       } else {
         setProducts([]);
       }
     }, (err) => {
        console.error("Firebase Realtime DB listener error:", err);
     });

     return () => {
       off(productsRef, 'value', unsubscribe);
       console.log(`Unsubscribed from wishlist ${wishlistId} products.`);
     };

  }, [wishlistId]);


   useEffect(() => {
       const fetchWishlistData = async () => {
           setLoading(true);
           setError(null);
           try {
               const token = await getIdToken();
               if (!token) {
                   setError("Authentication token not available. Please log in.");
                   setLoading(false);
                   return;
               }
               const data = await getWishlistDetails(wishlistId, token);
               setWishlist(data);
           } catch (err) {
               console.error("Failed to fetch wishlist details:", err);
               setError("Failed to load wishlist details: " + (err.message || "Please try again."));
               setWishlist(null);
           } finally {
               setLoading(false);
           }
       };

       if (currentUser && wishlistId) {
           fetchWishlistData();
       } else if (!currentUser) {
            setLoading(false);
       }

   }, [wishlistId, currentUser, getIdToken]);


   const handleAddProduct = async (productData) => {
       setIsAddModalOpen(false);
       try {
            const token = await getIdToken();
            if (!token) {
               alert("Authentication token not available.");
               return;
            }
           await addProductToWishlist(wishlistId, productData, token);
       } catch(err) {
           console.error("Failed to add product:", err);
           alert("Failed to add product: " + (err.message || "Unknown error."));
       }
   };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setIsEditModalOpen(true);
    };

    const handleUpdateProduct = async (productId, updates) => {
         setIsEditModalOpen(false);
         setEditingProduct(null);
         try {
             const token = await getIdToken();
             if (!token) {
                 alert("Authentication token not available.");
                 return;
             }
             await updateProductInWishlist(wishlistId, productId, updates, token);
         } catch (err) {
             console.error("Failed to update product:", err);
             alert("Failed to update product: " + (err.message || "Unknown error."));
         }
    };

    const handleDeleteProduct = async (productId) => {
        if (!window.confirm("Are you sure you want to delete this product?")) {
            return;
        }
        try {
            const token = await getIdToken();
            if (!token) {
                 alert("Authentication token not available.");
                 return;
            }
            await deleteProductFromWishlist(wishlistId, productId, token);
        } catch (err) {
            console.error("Failed to delete product:", err);
            alert("Failed to delete product: " + (err.message || "Unknown error."));
        }
    };


  if (loading) return <Container><Message>Loading wishlist...</Message></Container>;
  if (error) return <Container><Message style={{ color: 'var(--color-danger)' }}>Error: {error}</Message></Container>;
  if (!wishlist) return <Container><Message>Wishlist not found or access denied.</Message></Container>;

  return (
    <Container>
      <Title>{wishlist.name}</Title>
      {wishlist.description && <Description>{wishlist.description}</Description>}

      <AddButton onClick={() => setIsAddModalOpen(true)}>Add Product</AddButton>

      <ProductList>
        {products.length === 0 ? (
          <Message>No products in this wishlist yet. Add the first one!</Message>
        ) : (
          products.map(product => (
            <ProductItem
               key={product.id}
               product={product}
               isOwner={product.addedBy === currentUser?.uid}
               onDelete={() => handleDeleteProduct(product.id)}
               onEdit={() => handleEditProduct(product)}
            />
          ))
        )}
      </ProductList>

       <AddProductModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddProduct}
       />

        {editingProduct && (
            <EditProductModal
                isOpen={isEditModalOpen}
                onClose={() => { setIsEditModalOpen(false); setEditingProduct(null); }}
                product={editingProduct}
                onUpdate={handleUpdateProduct}
             />
        )}

    </Container>
  );
}

export default WishlistPage;