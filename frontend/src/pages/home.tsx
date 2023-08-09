import React, { useState, useEffect } from 'react';
import { useNavigate  } from 'react-router-dom';
import { getCookie } from 'typescript-cookie'

import { getProfile, listProducts, ProductType } from "../api_calls";
import { ProductTable } from '../components/product_table';

export const Home: React.FC = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState<ProductType[]>([]);
    const [balance, setBalance] = useState(0);

    // get bearer token
    async function callListProductApi() {
        const storedTokenInCookie = getCookie('bearerToken') as string;
    
        if (!storedTokenInCookie) {
          alert('Your session has expired, please re-log in!');
          navigate('/sign-in');
        } else {
          try {
            const products = await listProducts(storedTokenInCookie, 'yes' );

            setProducts(products);
          } catch (error) {
            console.error('API Error:', error);
          }
        }
    }

    async function callGetProfileApi() {
      const storedTokenInCookie = getCookie('bearerToken') as string;

      try {
        const profile = await getProfile(storedTokenInCookie);

        setBalance(profile.balance);
      } catch (error) {
        console.error('API Error:', error);
      }
    }

    useEffect(() => {
        callListProductApi()
        callGetProfileApi()
    }, []);


    return (
        <div className="container mt-4">
        {
            
            products.length > 0 &&
            <>
              <h3>Current Balance: ${balance}</h3>
              <ProductTable 
                  products={products}
                  setProducts={setProducts}
                  setBalance={setBalance}
              />
            </>
        }
      </div>
    )
}