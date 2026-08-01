import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { dealsProducts, newArrivals, bestSellers } from '../mock/mock';
import { fetchProductsFromAPI, addProductAPI, updateProductAPI, deleteProductAPI, deleteAllProductsAPI } from '../services/api';

const ProductContext = createContext();

const initialMockProducts = () => {
  const map = new Map();
  [...dealsProducts, ...newArrivals, ...bestSellers].forEach((p) => {
    if (p && p.id && !map.has(p.id)) {
      map.set(p.id, p);
    }
  });
  return Array.from(map.values());
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('rgms_products');
    if (saved !== null) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return [];
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sync products from Express backend REST API
  const refreshProducts = useCallback(async () => {
    setLoading(true);
    try {
      const apiData = await fetchProductsFromAPI('all');
      if (apiData && Array.isArray(apiData)) {
        setProducts(apiData);
        localStorage.setItem('rgms_products', JSON.stringify(apiData));
        setError(null);
      }
    } catch (err) {
      console.warn('Using cached products state:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  // Add Product (calls backend REST API + updates frontend state)
  const addProduct = async (newProdData) => {
    try {
      const createdProd = await addProductAPI(newProdData);
      setProducts((prev) => [createdProd, ...prev]);
      localStorage.setItem('rgms_products', JSON.stringify([createdProd, ...products]));
      return createdProd;
    } catch (err) {
      // Fallback local creation if token/backend not configured
      const fallbackProd = {
        id: `prod-${Date.now()}`,
        ...newProdData,
        price: Number(newProdData.price),
        oldPrice: newProdData.oldPrice ? Number(newProdData.oldPrice) : null,
        rating: Number(newProdData.rating) || 5.0,
        reviews: Number(newProdData.reviews) || 0,
        stock: Number(newProdData.stock) || 20,
        image: newProdData.image || '/assets/asset-1.png'
      };
      setProducts((prev) => [fallbackProd, ...prev]);
      localStorage.setItem('rgms_products', JSON.stringify([fallbackProd, ...products]));
      return fallbackProd;
    }
  };

  // Update Product
  const updateProduct = async (id, updatedFields) => {
    try {
      const updatedProd = await updateProductAPI(id, updatedFields);
      setProducts((prev) => prev.map((p) => (p.id === id ? updatedProd : p)));
      return updatedProd;
    } catch (err) {
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updatedFields } : p))
      );
    }
  };

  // Delete Product
  const deleteProduct = async (id) => {
    try {
      await deleteProductAPI(id);
    } catch (err) {
      // ignore
    }
    setProducts((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      localStorage.setItem('rgms_products', JSON.stringify(updated));
      return updated;
    });
  };

  // Clear All Products
  const clearAllProducts = async () => {
    try {
      await deleteAllProductsAPI();
    } catch (err) {
      // ignore
    }
    setProducts([]);
    localStorage.setItem('rgms_products', JSON.stringify([]));
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        error,
        refreshProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        clearAllProducts
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
