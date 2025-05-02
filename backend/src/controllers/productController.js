const admin = require('firebase-admin');
const db = admin.database();

exports.addProduct = async (req, res) => {
  const { wishlistId } = req.params;
  const userId = req.user.uid;
  const userEmail = req.user.email;

  const { name, price, imageUrl } = req.body;

  if (!name || price === undefined || price === null) {
    return res.status(400).send('Product name and price are required.');
  }
   const priceValue = parseFloat(price);
   if (isNaN(priceValue) || priceValue < 0) {
       return res.status(400).send('Price must be a valid non-negative number.');
   }

  try {
      const wishlistSnapshot = await db.ref(`wishlists/${wishlistId}`).once('value');
      const wishlist = wishlistSnapshot.val();

      if (!wishlist) {
          return res.status(404).send('Wishlist not found.');
      }

    const newProductRef = db.ref(`wishlists/${wishlistId}/products`).push();
    const productId = newProductRef.key;

    const newProduct = {
      id: productId,
      name: name.trim(),
      price: priceValue,
      imageUrl: imageUrl ? imageUrl.trim() : '',
      addedBy: userId,
      addedByEmail: userEmail || 'N/A',
      createdAt: admin.database.ServerValue.TIMESTAMP,
      updatedAt: admin.database.ServerValue.TIMESTAMP,
    };

    await newProductRef.set(newProduct);
    await db.ref(`wishlists/${wishlistId}/updatedAt`).set(admin.database.ServerValue.TIMESTAMP);

    res.status(201).json(newProduct);

  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).send('Internal Server Error.');
  }
};

exports.updateProduct = async (req, res) => {
    const { wishlistId, productId } = req.params;
    const userId = req.user.uid;
    const updates = req.body;

     if (!updates || Object.keys(updates).length === 0) {
         return res.status(400).send('No update data provided.');
     }

     if (updates.price !== undefined) {
         const priceValue = parseFloat(updates.price);
         if (isNaN(priceValue) || priceValue < 0) {
             return res.status(400).send('Price must be a valid non-negative number.');
         }
         updates.price = priceValue;
     }
     if (updates.name !== undefined && !updates.name.trim()) {
         return res.status(400).send('Product name cannot be empty.');
     }
     if (updates.name !== undefined) updates.name = updates.name.trim();
     if (updates.imageUrl !== undefined) updates.imageUrl = updates.imageUrl.trim();


    try {
        const productRef = db.ref(`wishlists/${wishlistId}/products/${productId}`);
        const productSnapshot = await productRef.once('value');
        const product = productSnapshot.val();

        if (!product) {
            return res.status(404).send('Product not found.');
        }

        if (product.addedBy !== userId) {
            return res.status(403).send('Forbidden: You can only update products you added.');
        }

        const allowedUpdates = {};
        if (updates.name !== undefined) allowedUpdates.name = updates.name;
        if (updates.price !== undefined) allowedUpdates.price = updates.price;
        if (updates.imageUrl !== undefined) allowedUpdates.imageUrl = updates.imageUrl;

        allowedUpdates.updatedAt = admin.database.ServerValue.TIMESTAMP;


        await productRef.update(allowedUpdates);
        await db.ref(`wishlists/${wishlistId}/updatedAt`).set(admin.database.ServerValue.TIMESTAMP);

        const updatedSnapshot = await productRef.once('value');
        const updatedProduct = updatedSnapshot.val();

        res.status(200).json(updatedProduct);

    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).send('Internal Server Error.');
    }
};

exports.deleteProduct = async (req, res) => {
    const { wishlistId, productId } = req.params;
    const userId = req.user.uid;

    try {
        const productRef = db.ref(`wishlists/${wishlistId}/products/${productId}`);
        const productSnapshot = await productRef.once('value');
        const product = productSnapshot.val();

        if (!product) {
            return res.status(404).send('Product not found.');
        }

        if (product.addedBy !== userId) {
            return res.status(403).send('Forbidden: You can only delete products you added.');
        }

        await productRef.remove();
        await db.ref(`wishlists/${wishlistId}/updatedAt`).set(admin.database.ServerValue.TIMESTAMP);


        res.status(200).send('Product deleted successfully.');

    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).send('Internal Server Error.');
    }
};