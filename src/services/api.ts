const API_URL = 'http://localhost:5000/api';


export const api = {
  // Public endpoints
  getAllProducts: async () => {
    const response = await fetch(`${API_URL}/products`);
    return response.json();
  },

  getProductById: async (id: string) => {
    const response = await fetch(`${API_URL}/products/${id}`);
    return response.json();
  },

  // Admin Dashboard
  getAdminStats: async () => {
    const response = await fetch(`${API_URL}/admin/stats`, {
      credentials: 'include'
    });
    return response.json();
  },

  // Users
  getUsers: async () => {
    const response = await fetch(`${API_URL}/admin/users`, {
      credentials: 'include'
    });
    return response.json();
  },

  createUser: async (userData: {
    name: string;
    email: string;
    password: string;
    isAdmin: boolean;
  }) => {
    const response = await fetch(`${API_URL}/admin/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create user');
    }
    return response.json();
  },

  deleteUser: async (userId: string) => {
    const response = await fetch(`${API_URL}/admin/users/${userId}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    return response.json();
  },

  // Products
  getProducts: async () => {
    const response = await fetch(`${API_URL}/admin/products`, {
      credentials: 'include'
    });
    return response.json();
  },

  createProduct: async (productData: FormData) => {
    const response = await fetch(`${API_URL}/admin/products`, {
      method: 'POST',
      credentials: 'include',
      body: productData
    });
    return response.json();
  },

  updateProduct: async (productId: string, productData: FormData) => {
    const response = await fetch(`${API_URL}/admin/products/${productId}`, {
      method: 'PUT',
      credentials: 'include',
      body: productData
    });
    return response.json();
  },

  deleteProduct: async (productId: string) => {
    const response = await fetch(`${API_URL}/admin/products/${productId}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    return response.json();
  },

  // Orders
  getOrders: async () => {
    const response = await fetch(`${API_URL}/admin/orders`, {
      credentials: 'include'
    });
    return response.json();
  },

  updateOrderStatus: async (orderId: string, status: string) => {
    const response = await fetch(`${API_URL}/admin/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ status })
    });
    return response.json();
  },

  // Reviews
  getReviews: async () => {
    const response = await fetch(`${API_URL}/admin/reviews`, {
      credentials: 'include'
    });
    return response.json();
  },

  deleteReview: async (reviewId: string) => {
    const response = await fetch(`${API_URL}/admin/reviews/${reviewId}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    return response.json();
  },

  // Reviews
  getProductReviews: async (productId: string) => {
    const response = await fetch(`${API_URL}/reviews/product/${productId}`, {
      credentials: 'include'
    });
    return response.json();
  },

  submitReview: async (productId: string, data: { rating: number; comment: string }) => {
    const response = await fetch(`${API_URL}/reviews/${productId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to submit review');
    }
    return response.json();
  },

  markReviewHelpful: async (reviewId: string) => {
    const response = await fetch(`${API_URL}/reviews/${reviewId}/helpful`, {
      method: 'POST',
      credentials: 'include',
    });
    return response.json();
  },

  // Add new methods for chatbot
  getMyOrders: async () => {
    const response = await fetch(`${API_URL}/orders/my-orders`, {
      credentials: 'include'
    });
    if (!response.ok) {
      throw new Error('Failed to fetch orders');
    }
    return response.json();
  },

  searchProducts: async (query: string) => {
    const response = await fetch(`${API_URL}/products/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error('Failed to search products');
    }
    return response.json();
  },

  getProductStock: async (productId: string) => {
    const response = await fetch(`${API_URL}/products/${productId}/stock`);
    if (!response.ok) {
      throw new Error('Failed to get stock information');
    }
    return response.json();
  }
};
