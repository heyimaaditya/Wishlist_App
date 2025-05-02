const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const productController = require('../controllers/productController');
const verifyToken = require('../middleware/auth');

router.use(verifyToken);

// Wishlist Routes
router.post('/', wishlistController.createWishlist);
router.get('/', wishlistController.getWishlists);
router.get('/:id', wishlistController.getWishlistDetails);
router.put('/:id', wishlistController.updateWishlist);
router.delete('/:id', wishlistController.deleteWishlist);

// Product Routes (nested)
router.post('/:wishlistId/products', productController.addProduct);
router.put('/:wishlistId/products/:productId', productController.updateProduct);
router.delete('/:wishlistId/products/:productId', productController.deleteProduct);


module.exports = router;