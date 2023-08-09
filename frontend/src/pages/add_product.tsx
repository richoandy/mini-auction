import React from "react";
import { getCookie } from 'typescript-cookie'
import { useNavigate  } from 'react-router-dom';
import { useForm, Controller } from "react-hook-form";
import { Form, Button, Container, Row, Col } from "react-bootstrap"
import { addProduct } from '../api_calls';

interface addProductData {
    name: string,
    price: number,
    time_period: number,
}

export const AddProduct: React.FC = () => {
    const {
        control,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<addProductData>();

    const navigate = useNavigate();

    const onSubmit = async (data: addProductData) => {
        try {
            const storedTokenInCookie = getCookie('bearerToken') as string;

            await addProduct(storedTokenInCookie, data.name, data.price, data.time_period);

            alert('product is added');
            reset();
            navigate('/');
        } catch (error: any) {
            console.log(error);
            alert(error.response.data.message);
        }
    }

    return (
        <>
            <Container>
            <Row className="justify-content-md-center">
                <Col xs={12} md={6}>
                <h1 className="m-5">Add Product</h1>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Form.Group controlId="formBasicName">
                    <Form.Label className="my-3">Product Name</Form.Label>
                    <Controller
                        name="name"
                        control={control}
                        defaultValue=""
                        rules={{
                        required: "name is required",
                        }}
                        render={({ field }) => (
                        <Form.Control
                            type="text"
                            placeholder="Enter name"
                            {...field}
                        />
                        )}
                    />
                    {errors.name && (
                        <span className="text-danger">{errors.name.message}</span>
                    )}
                    </Form.Group>
    
                    <Form.Group controlId="formBasicPrice">
                    <Form.Label className="my-3">Price</Form.Label>
                    <Controller
                        name="price"
                        control={control}
                        rules={{
                        required: "Price is required"
                        }}
                        render={({ field }) => (
                        <Form.Control
                            type="text"
                            placeholder="price"
                            {...field}
                        />
                        )}
                    />
                    {errors.price && (
                        <span className="text-danger">{errors.price.message}</span>
                    )}
                    </Form.Group>

                    <Form.Group controlId="formBasicTimePeriod">
                    <Form.Label className="my-3">Time Period</Form.Label>
                    <Controller
                        name="time_period"
                        control={control}
                        rules={{
                        required: "time period is required"
                        }}
                        render={({ field }) => (
                        <Form.Control
                            type="text"
                            placeholder="time period"
                            {...field}
                        />
                        )}
                    />
                    {errors.price && (
                        <span className="text-danger">{errors.price.message}</span>
                    )}
                    </Form.Group>
    
                    <Button variant="primary" type="submit"
                    className="my-3"
                    >
                    Submit
                    </Button>
                </Form>
                </Col>
            </Row>
            </Container>
        </>
      );
}