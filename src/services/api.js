let ACTIVE_API_BASE = 'http://localhost:5000/api';

const getApiBase = async () => {
  try {
    const res = await fetch('http://localhost:5000/api/health', { signal: AbortSignal.timeout(1000) });
    if (res.ok) {
      ACTIVE_API_BASE = 'http://localhost:5000/api';
      return ACTIVE_API_BASE;
    }
  } catch (e) {
    ACTIVE_API_BASE = 'http://localhost:5001/api';
  }
  return ACTIVE_API_BASE;
};

// Helper to get JWT headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('rgms_admin_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Fetch products from backend
export const fetchProductsFromAPI = async (category = 'all') => {
  try {
    const baseUrl = await getApiBase();
    const res = await fetch(`${baseUrl}/products?category=${category}`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return await res.json();
  } catch (err) {
    console.warn('Backend API fetch error:', err.message);
    return null;
  }
};

// Admin Login with JWT
export const loginAdminAPI = async (username, password) => {
  const baseUrl = await getApiBase();
  const res = await fetch(`${baseUrl}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Login failed');
  return data;
};

// Verify JWT Token
export const verifyTokenAPI = async () => {
  try {
    const baseUrl = await getApiBase();
    const res = await fetch(`${baseUrl}/admin/verify`, {
      headers: { ...getAuthHeaders() }
    });
    if (!res.ok) return false;
    const data = await res.json();
    return data.valid;
  } catch (err) {
    return false;
  }
};

// Upload Product Image to Cloudinary via backend
export const uploadProductImageAPI = async (imageFileOrBase64) => {
  try {
    const baseUrl = await getApiBase();
    const formData = new FormData();
    if (imageFileOrBase64 instanceof File) {
      formData.append('image', imageFileOrBase64);
    } else {
      formData.append('image', imageFileOrBase64);
    }

    const res = await fetch(`${baseUrl}/upload`, {
      method: 'POST',
      body: imageFileOrBase64 instanceof File ? formData : JSON.stringify({ image: imageFileOrBase64 }),
      headers: imageFileOrBase64 instanceof File ? {} : { 'Content-Type': 'application/json' }
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Image upload failed');
    return data.url;
  } catch (err) {
    console.error('Image upload service error:', err);
    throw err;
  }
};

// Add New Product
export const addProductAPI = async (productData) => {
  const baseUrl = await getApiBase();
  const res = await fetch(`${baseUrl}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify(productData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to create product');
  return data.product;
};

// Update Product
export const updateProductAPI = async (id, productData) => {
  const baseUrl = await getApiBase();
  const res = await fetch(`${baseUrl}/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify(productData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update product');
  return data.product;
};

// Delete Product
export const deleteProductAPI = async (id) => {
  const baseUrl = await getApiBase();
  const res = await fetch(`${baseUrl}/products/${id}`, {
    method: 'DELETE',
    headers: { ...getAuthHeaders() }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to delete product');
  return data;
};

// Clear All Products
export const deleteAllProductsAPI = async () => {
  const baseUrl = await getApiBase();
  const res = await fetch(`${baseUrl}/products/all`, {
    method: 'DELETE',
    headers: { ...getAuthHeaders() }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to delete all products');
  return data;
};

// Send Contact Message (Public)
export const sendContactMessageAPI = async (contactData) => {
  const baseUrl = await getApiBase();
  const res = await fetch(`${baseUrl}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(contactData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to send message');
  return data;
};

// Fetch Contact Messages (Admin Protected)
export const fetchContactMessagesAPI = async () => {
  const baseUrl = await getApiBase();
  const res = await fetch(`${baseUrl}/contact`, {
    headers: { ...getAuthHeaders() }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch contact messages');
  return data;
};

// Mark Contact Message as Read (Admin Protected)
export const markContactMessageReadAPI = async (id) => {
  const baseUrl = await getApiBase();
  const res = await fetch(`${baseUrl}/contact/${id}/read`, {
    method: 'PUT',
    headers: { ...getAuthHeaders() }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to mark message read');
  return data;
};

// Delete Contact Message (Admin Protected)
export const deleteContactMessageAPI = async (id) => {
  const baseUrl = await getApiBase();
  const res = await fetch(`${baseUrl}/contact/${id}`, {
    method: 'DELETE',
    headers: { ...getAuthHeaders() }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to delete message');
  return data;
};
