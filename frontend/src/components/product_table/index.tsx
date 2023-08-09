import React from 'react';
import { Table, Button } from 'react-bootstrap';

import { ProductType } from "../../api_calls";
import { ProductItem } from "./product_item";

interface ProductTableProps {
    products: ProductType[];
    setProducts: React.Dispatch<React.SetStateAction<ProductType[]>>;
    setBalance: React.Dispatch<React.SetStateAction<0>>;
}

export const ProductTable: React.FC<ProductTableProps> = (props) => {

    return (
        <div className="container mt-4">
            {props.products.length > 0 && (
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Starting Price</th>
                    <th>Current Price</th>
                    <th>Bid</th>
                </tr>
                </thead>
                <tbody>
                {
                    props.products.map(product => (
                        <ProductItem
                            product={product}
                            setProducts={props.setProducts}
                            setBalance={props.setBalance}
                        />
                    ))
                }
                </tbody>
            </Table>
            )}
        </div>
    );
};
