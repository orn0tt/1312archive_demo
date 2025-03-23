// services/api.js
import axios from 'axios';

// Configuração do cliente axios para o backend Java
const api = axios.create({
  baseURL: 'https://seu-backend-java.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Funções para chamadas de API
export const fetchFeaturedProducts = async () => {
  try {
    // Em produção, descomentar esta linha para usar a API real
    // const response = await api.get('/products/featured');
    // return response.data;
    
    // Dados simulados para desenvolvimento
    return [
      {
        id: 1,
        name: 'Jaqueta Oversized',
        brand: 'Balenciaga',
        price: 'R$ 4.990,00',
        image: 'https://placehold.co/600x800/111/fff?text=Jaqueta',
      },
      {
        id: 2,
        name: 'Calça Wide Leg',
        brand: 'Prada',
        price: 'R$ 3.590,00',
        image: 'https://placehold.co/600x800/111/fff?text=Calça',
      },
      {
        id: 3,
        name: 'Vestido Slip',
        brand: 'Saint Laurent',
        price: 'R$ 5.790,00',
        image: 'https://placehold.co/600x800/111/fff?text=Vestido',
      },
      {
        id: 4,
        name: 'Blazer Estruturado',
        brand: 'Gucci',
        price: 'R$ 7.290,00',
        image: 'https://placehold.co/600x800/111/fff?text=Blazer',
      },
      {
        id: 5,
        name: 'Camiseta Estampada',
        brand: 'Off-White',
        price: 'R$ 1.990,00',
        image: 'https://placehold.co/600x800/111/fff?text=Camiseta',
      },
      {
        id: 6,
        name: 'Tênis Chunky',
        brand: 'Balenciaga',
        price: 'R$ 6.490,00',
        image: 'https://placehold.co/600x800/111/fff?text=Tênis',
      },
    ];
  } catch (error) {
    console.error('Erro ao buscar produtos em destaque:', error);
    throw error;
  }
};

export const fetchCollections = async () => {
  try {
    // Em produção, descomentar esta linha para usar a API real
    // const response = await api.get('/collections');
    // return response.data;
    
    // Dados simulados para desenvolvimento
    return [
      {
        id: 1,
        name: 'Minimalismo Europeu',
        description: 'Peças essenciais com design atemporal',
        image: 'https://placehold.co/800x400/111/fff?text=Minimalismo',
      },
      {
        id: 2,
        name: 'Streetwear de Luxo',
        description: 'A fusão perfeita entre casual e sofisticado',
        image: 'https://placehold.co/800x400/111/fff?text=Streetwear',
      },
      {
        id: 3,
        name: 'Alfaiataria Japonesa',
        description: 'Cortes precisos e tecidos premium',
        image: 'https://placehold.co/800x400/111/fff?text=Alfaiataria',
      },
      {
        id: 4,
        name: 'Vintage Selecionado',
        description: 'Peças raras de décadas passadas',
        image: 'https://placehold.co/800x400/111/fff?text=Vintage',
      },
    ];
  } catch (error) {
    console.error('Erro ao buscar coleções:', error);
    throw error;
  }
};

export const addToCart = async (productId, quantity = 1) => {
  try {
    // Em produção, descomentar esta linha para usar a API real
    // const response = await api.post('/cart/add', { productId, quantity });
    // return response.data;
    
    // Simulação de resposta
    return { success: true, message: 'Produto adicionado ao carrinho' };
  } catch (error) {
    console.error('Erro ao adicionar ao carrinho:', error);
    throw error;
  }
};

export default api;