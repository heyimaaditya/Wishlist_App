const admin = require('firebase-admin');
const db = admin.database();

const objectToArray = (obj) => {
    if (!obj) return [];
    return Object.keys(obj).map(key => ({ id: key, ...obj[key] }));
};

exports.createWishlist = async (req, res) => {
  const userId = req.user.uid;
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).send('Wishlist name is required.');
  }

  try {
    const newWishlistRef = db.ref('wishlists').push();
    const wishlistId = newWishlistRef.key;

    const newWishlist = {
      id: wishlistId,
      name: name,
      description: description || '',
      ownerId: userId,
      createdAt: admin.database.ServerValue.TIMESTAMP,
      updatedAt: admin.database.ServerValue.TIMESTAMP,
    };

    await newWishlistRef.set(newWishlist);
    await db.ref(`users/${userId}/wishlists/${wishlistId}`).set(true);

    res.status(201).json(newWishlist);

  } catch (error) {
    console.error('Error creating wishlist:', error);
    res.status(500).send('Internal Server Error.');
  }
};

exports.getWishlists = async (req, res) => {
    const userId = req.user.uid;

    try {
        const userWishlistsSnapshot = await db.ref(`users/${userId}/wishlists`).once('value');
        const wishlistIds = userWishlistsSnapshot.val();

        if (!wishlistIds) {
            return res.json([]);
        }

        const wishlistPromises = Object.keys(wishlistIds).map(async (id) => {
            const wishlistSnapshot = await db.ref(`wishlists/${id}`).once('value');
            return wishlistSnapshot.val();
        });

        const wishlists = await Promise.all(wishlistPromises);
        const filteredWishlists = wishlists.filter(wishlist => wishlist !== null);

        res.json(filteredWishlists);

    } catch (error) {
        console.error('Error getting wishlists:', error);
        res.status(500).send('Internal Server Error.');
    }
};

exports.getWishlistDetails = async (req, res) => {
    const { id: wishlistId } = req.params;
    const userId = req.user.uid;

    try {
        const wishlistSnapshot = await db.ref(`wishlists/${wishlistId}`).once('value');
        const wishlist = wishlistSnapshot.val();

        if (!wishlist) {
            return res.status(404).send('Wishlist not found.');
        }

        const productsSnapshot = await db.ref(`wishlists/${wishlistId}/products`).once('value');
        const products = productsSnapshot.val();

        const wishlistDetails = {
            ...wishlist,
            products: objectToArray(products)
        };

        res.json(wishlistDetails);

    } catch (error) {
        console.error('Error getting wishlist details:', error);
        res.status(500).send('Internal Server Error.');
    }
};

exports.updateWishlist = async (req, res) => {
    const { id: wishlistId } = req.params;
    const userId = req.user.uid;
    const updates = req.body;

     if (!updates || Object.keys(updates).length === 0) {
         return res.status(400).send('No update data provided.');
     }
     if (updates.name !== undefined && !updates.name.trim()) {
         return res.status(400).send('Wishlist name cannot be empty.');
     }

    try {
        const wishlistRef = db.ref(`wishlists/${wishlistId}`);
        const wishlistSnapshot = await wishlistRef.once('value');
        const wishlist = wishlistSnapshot.val();

        if (!wishlist) {
            return res.status(404).send('Wishlist not found.');
        }

        if (wishlist.ownerId !== userId) {
            return res.status(403).send('Forbidden: You can only update wishlists you own.');
        }

        const allowedUpdates = {};
        if (updates.name !== undefined) allowedUpdates.name = updates.name.trim();
        if (updates.description !== undefined) allowedUpdates.description = updates.description.trim();

        allowedUpdates.updatedAt = admin.database.ServerValue.TIMESTAMP;

        await wishlistRef.update(allowedUpdates);

        const updatedSnapshot = await wishlistRef.once('value');
        const updatedWishlist = updatedSnapshot.val();

        res.status(200).json(updatedWishlist);

    } catch (error) {
        console.error('Error updating wishlist:', error);
        res.status(500).send('Internal Server Error.');
    }
};

exports.deleteWishlist = async (req, res) => {
    const { id: wishlistId } = req.params;
    const userId = req.user.uid;

    try {
        const wishlistRef = db.ref(`wishlists/${wishlistId}`);
        const wishlistSnapshot = await wishlistRef.once('value');
        const wishlist = wishlistSnapshot.val();

        if (!wishlist) {
            return res.status(404).send('Wishlist not found.');
        }

        if (wishlist.ownerId !== userId) {
            return res.status(403).send('Forbidden: You can only delete wishlists you own.');
        }

        await wishlistRef.remove();
        await db.ref(`users/${userId}/wishlists/${wishlistId}`).remove();

        res.status(200).send('Wishlist deleted successfully.');

    } catch (error) {
        console.error('Error deleting wishlist:', error);
        res.status(500).send('Internal Server Error.');
    }
};