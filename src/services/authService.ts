import { AuthResponse } from '../types';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';
const ENCRYPTION_KEY = 'ecommerce-clothes-frontend-auth';

interface SecureTokenData {
  token: string;
  user: { name: string; email: string };
  expiresAt: number;
  refreshedAt: number;
}

class AuthService {
  private static instance: AuthService;
  private encryptionKey: string;

  private constructor() {
    this.encryptionKey = this.deriveEncryptionKey();
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private deriveEncryptionKey(): string {
    // Derive encryption key from environment variable for better security
    const baseKey = process.env.REACT_APP_ENCRYPTION_KEY || 'default-dev-key-change-in-production';
    return this.saltKey(baseKey);
  }

  private saltKey(key: string): string {
    // Simple salt implementation for demo purposes
    // In production, use proper key derivation function (PBKDF2)
    return key + '-salted-with-nonce-' + Date.now().toString(36).slice(-8);
  }

  private encrypt(data: string): string {
    // Basic encryption for demo - use proper libraries in production
    try {
      const encrypted = btoa(data);
      return encrypted;
    } catch {
      return data;
    }
  }

  private decrypt(data: string): string {
    // Basic decryption for demo - use proper libraries in production
    try {
      return atob(data);
    } catch {
      return data;
    }
  }

  private generateToken(): string {
    // Generate secure token using crypto API if available
    if (typeof window !== 'undefined' && window.crypto) {
      const array = new Uint8Array(32);
      window.crypto.getRandomValues(array);
      return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }
    // Fallback for environments without crypto API
    return Math.random().toString(36).substring(2, 15) +
           Math.random().toString(36).substring(2, 15);
  }

  private validateToken(token: string): boolean {
    // Basic token validation
    if (!token || typeof token !== 'string') return false;
    if (token.length < 32) return false;
    // Check if token contains expected patterns
    return /^[a-zA-Z0-9_-]+$/.test(token);
  }

  private validateEmail(email: string): boolean {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  public login(response: AuthResponse): void {
    if (!response.success || !response.token) {
      throw new Error('Invalid login response');
    }

    const token = response.token;
    if (!this.validateToken(token)) {
      throw new Error('Invalid token received');
    }

    const userData = response.user || { name: 'User', email: 'user@example.com' };
    if (!this.validateEmail(userData.email)) {
      throw new Error('Invalid user email');
    }

    const secureData: SecureTokenData = {
      token,
      user: userData,
      expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
      refreshedAt: Date.now(),
    };

    localStorage.setItem(TOKEN_KEY, this.encrypt(JSON.stringify(secureData)));
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
  }

  public logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    // Clear any other auth-related storage
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('auth-')) {
        localStorage.removeItem(key);
      }
    });
  }

  public getToken(): string | null {
    try {
      const encryptedToken = localStorage.getItem(TOKEN_KEY);
      if (!encryptedToken) return null;

      const decrypted = this.decrypt(encryptedToken);
      const tokenData: SecureTokenData = JSON.parse(decrypted);

      // Check if token is expired
      if (Date.now() > tokenData.expiresAt) {
        this.logout();
        return null;
      }

      // Refresh token if it's about to expire (within 1 hour)
      if (Date.now() > tokenData.refreshAt + (23 * 60 * 60 * 1000)) {
        tokenData.refreshAt = Date.now();
        localStorage.setItem(TOKEN_KEY, this.encrypt(JSON.stringify(tokenData)));
      }

      return tokenData.token;
    } catch (error) {
      console.error('Error retrieving token:', error);
      this.logout();
      return null;
    }
  }

  public getUser(): { name: string; email: string } | null {
    try {
      const userData = localStorage.getItem(USER_KEY);
      if (!userData) return null;

      return JSON.parse(userData);
    } catch (error) {
      console.error('Error retrieving user:', error);
      this.logout();
      return null;
    }
  }

  public isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getUser();
    return !!(token && user);
  }

  public generateCSRFToken(): string {
    // Generate CSRF token using secure random generation
    return this.generateToken();
  }

  public validateCSRFToken(token: string): boolean {
    // Basic CSRF token validation
    if (!token || typeof token !== 'string') return false;
    return token.length >= 32 && /^[a-zA-Z0-9]+$/.test(token);
  }

  public getAuthHeaders(): HeadersInit {
    const token = this.getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['auth-token'] = token;
    }

    return headers;
  }

  public clearExpiredData(): void {
    // Clear any expired tokens or invalid data
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      try {
        const decrypted = this.decrypt(token);
        const tokenData: SecureTokenData = JSON.parse(decrypted);
        if (Date.now() > tokenData.expiresAt) {
          this.logout();
        }
      } catch {
        this.logout();
      }
    }
  }

  public getSecurityReport(): {
    tokenPresent: boolean;
    userPresent: boolean;
    tokenExpired: boolean;
    tokenValid: boolean;
    authHeaders: HeadersInit;
  } {
    const token = this.getToken();
    const user = this.getUser();
    const isAuthenticated = this.isAuthenticated();

    return {
      tokenPresent: !!token,
      userPresent: !!user,
      tokenExpired: !isAuthenticated && !!token,
      tokenValid: isAuthenticated,
      authHeaders: this.getAuthHeaders(),
    };
  }
}

export default AuthService.getInstance();