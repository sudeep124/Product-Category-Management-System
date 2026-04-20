import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/v1',
  headers: {
    'Content-Type': 'application/json'
  }
});

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  status: 'active' | 'inactive';
  sortOrder: number;
  iconColor?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryNode extends Category {
  children: CategoryNode[];
}

export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    const { data } = await api.get('/categories');
    return data;
  },
  getTree: async (): Promise<CategoryNode[]> => {
    const { data } = await api.get('/categories/tree');
    return data;
  },
  create: async (category: Partial<Category>) => {
    const { data } = await api.post('/categories', category);
    return data;
  },
  update: async ({ id, ...category }: Partial<Category> & { id: string }) => {
    const { data } = await api.put(`/categories/${id}`, category);
    return data;
  },
  updateStatus: async ({ id, status }: { id: string, status: 'active' | 'inactive' }) => {
    const { data } = await api.patch(`/categories/${id}/status`, { status });
    return data;
  },
  delete: async (id: string) => {
    const { data } = await api.delete(`/categories/${id}`);
    return data;
  }
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  login: async (credentials: any) => {
    const { data } = await api.post('/auth/login', credentials);
    return data;
  },
  register: async (credentials: any) => {
    const { data } = await api.post('/auth/register', credentials);
    return data;
  }
};

export const productsApi = {
  create: async (productData: any) => {
    const { data } = await api.post('/products', productData);
    return data;
  }
};

export default api;
