import axios from 'axios';
import { ErrorPage } from '../pages/error';
import { AirportShuttle } from '@mui/icons-material';

type SignIn = {
  token: string;
}

export type ProductType = {
  id: string;
  seller_id?: string;
  name?: string;
  starting_price?: number;
  current_price?: number;
  is_available?: boolean;
  time_window?: number;
  created_at?: Date;
  updated_at?: Date;
};

export type User = {
  id?: string;
  email?: string;
  password?: string;
  balance?: number;
  last_bid_at?: Date;
  created_at?: Date;
  updated_at?: Date;
}

export async function signUp(email: string, password: string) {
    try {
      await axios.post('http://localhost:3800/user/signup', {
        email, password
      });
    } catch (e) {
      throw e;
    }
}

export async function signIn(email: string, password: string): Promise<SignIn> {
  try {
    const { data: signInSession } = await axios.post('http://localhost:3800/user/signin', {
      email, password
    });

    return signInSession;
  } catch (e) {
    throw e;
  }
}

export async function listProducts(sessionToken: string, isAvailable: string): Promise<ProductType[]> {
  try {
    const { data: products } = await axios.get('http://localhost:3800/product?online_product_only=' + isAvailable, {
      headers: {
        Authorization: `Bearer ${sessionToken}`
      }
    });

    console.log(products);
    return products;
  } catch (error) {
    throw error;    
  }
}

export async function bid(sessionToken: string, price: number, productId: string): Promise<void> {
  try {
    return axios.post('http://localhost:3800/bid', {
      product_id: productId,
      price
    }, {
      headers: {
        Authorization: `Bearer ${sessionToken}`
      }
    })
  } catch (error) {
    throw error;
  }
}

export async function addProduct(sessionToken: string, name: string, price: number, timeWindow: number): Promise<void> {
  try {
    return axios.post('http://localhost:3800/product',
      {
        name, starting_price: price, time_window: timeWindow
      },
      { headers: { Authorization: `Bearer ${sessionToken}` }}
    );
  } catch (error) {
    throw error;
  }
}

export async function deposit(userId: string, amount: number): Promise<void> {
  try {
    return axios.post('http://localhost:3800/user/deposit', {
      id: userId,
      amount
    })
  } catch (error) {
    throw error;
  } 
}

export async function getProfile(token: string): Promise<User> {
  try {
    const { data: user } = await axios.get(`http://localhost:3800/user`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return user;
  } catch (error) {
    throw error;
  }
}