const API_URL = import.meta.env.MODE === 'development' ? 'http://localhost:5000/api' : 'https://wishlist-app-mxtd.onrender.com/api';

const fetchAuthenticated = async (url, method = 'GET', body = null, token) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options = {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  };

   if (method === 'GET' || method === 'HEAD') {
        delete options.body;
   }

  const response = await fetch(url, options);

  if (!response.ok) {
    const errorBody = await response.text().catch(() => 'Unknown error');
    console.error(`API Error ${response.status}: ${response.statusText}`, errorBody);
    throw new Error(`API Error ${response.status}: ${errorBody || response.statusText}`);
  }

  const contentType = response.headers.get('content-type');
   if (contentType && contentType.indexOf('application/json') !== -1) {
      return response.json();
   } else {
       return response.text().then(text => text || null).catch(() => null);
   }
};

export const createWishlist = async (wishlistData, token) => {
  return fetchAuthenticated(`${API_URL}/wishlists`, 'POST', wishlistData, token);
};

export const getWishlists = async (token) => {
  return fetchAuthenticated(`${API_URL}/wishlists`, 'GET', null, token);
};

export const getWishlistDetails = async (wishlistId, token) => {
  return fetchAuthenticated(`${API_URL}/wishlists/${wishlistId}`, 'GET', null, token);
};

export const updateWishlist = async (wishlistId, updates, token) => {
    return fetchAuthenticated(`${API_URL}/wishlists/${wishlistId}`, 'PUT', updates, token);
};

export const deleteWishlist = async (wishlistId, token) => {
    return fetchAuthenticated(`${API_URL}/wishlists/${wishlistId}`, 'DELETE', null, token);
};

export const addProductToWishlist = async (wishlistId, productData, token) => {
  return fetchAuthenticated(`${API_URL}/wishlists/${wishlistId}/products`, 'POST', productData, token);
};

export const updateProductInWishlist = async (wishlistId, productId, updates, token) => {
    return fetchAuthenticated(`${API_URL}/wishlists/${wishlistId}/products/${productId}`, 'PUT', updates, token);
};

export const deleteProductFromWishlist = async (wishlistId, productId, token) => {
  return fetchAuthenticated(`${API_URL}/wishlists/${wishlistId}/products/${productId}`, 'DELETE', null, token);
};