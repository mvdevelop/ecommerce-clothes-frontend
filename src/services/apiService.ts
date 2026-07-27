import { Product } from '../types';

const API_BASE_URL = 'http://localhost:4000';

export class ApiService {
  static async getAllProducts(): Promise<Product[]> {
    const response = await fetch(`${API_BASE_URL}/allproducts`);
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }
    return response.json();
  }

  static async getPopularProducts(): Promise<Product[]> {
    const response = await fetch(`${API_BASE_URL}/popularinwomen`);
    if (!response.ok) {
      throw new Error(`Failed to fetch popular products: ${response.statusText}`);
    }
    return response.json();
  }

  static async getNewCollections(): Promise<Product[]> {
    const response = await fetch(`${API_BASE_URL}/newcollections`);
    if (!response.ok) {
      throw new Error(`Failed to fetch new collections: ${response.statusText}`);
    }
    return response.json();
  }

  static async getProductById(id: number): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/allproducts`);
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }
    const products = await response.json();
    const product = products.find((p: Product) => p.id === id);
    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }
    return product;
  }

  static async validateCoupon(code: string, subtotal: number): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/coupons/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, subtotal }),
    });
    if (!response.ok) {
      throw new Error(`Failed to validate coupon: ${response.statusText}`);
    }
    return response.json();
  }

  static async calculateShipping(zipCode: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/shipping/calculate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ zipCode }),
    });
    if (!response.ok) {
      throw new Error(`Failed to calculate shipping: ${response.statusText}`);
    }
    return response.json();
  }
}

export default ApiService;