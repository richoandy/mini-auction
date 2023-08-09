import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { getCookie } from 'typescript-cookie'

import InputModal from '../bid_modal';
import { ProductType, bid, listProducts,getProfile } from "../../api_calls";

interface ProductTableProps {
    product: ProductType;
    setProducts: React.Dispatch<React.SetStateAction<ProductType[]>>;
    setBalance: React.Dispatch<React.SetStateAction<0>>;
}

export const ProductItem: React.FC<ProductTableProps> = (props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
      };
    
      const closeModal = () => {
        setIsModalOpen(false);
      };
    
      const handleSubmitBid = async (inputValue: string) => {
        try {
            const storedTokenInCookie = getCookie('bearerToken') as string;

            await bid(storedTokenInCookie, Number(inputValue), props.product.id);
    
            const [products, profile] = await Promise.all([
                listProducts(storedTokenInCookie, 'yes'), getProfile(storedTokenInCookie)
            ]);
    
            props.setProducts(products);
            props.setBalance(profile.balance);
            alert(`congrats! bid has been created: ${inputValue}`)
        } catch (error: any) {
            alert(error.response.data.message);
        } finally {
            closeModal();
        }

        
      };

     return (
        <tr key={props.product.id}>
        <td>{props.product.id}</td>
        <td>{props.product.name}</td>
        <td>{props.product.starting_price}</td>
        <td>{props.product.current_price}</td>
        <td><Button onClick={openModal}>Bid</Button></td>
        <InputModal
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            onSubmit={handleSubmitBid}
        />
        </tr>
     )
}

