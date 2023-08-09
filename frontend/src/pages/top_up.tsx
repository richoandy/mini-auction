import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { deposit } from "../api_calls";

interface depositData {
    userId: string,
    amount: number
};

export const TopUp: React.FC = () => {
    const {
        control,    
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<depositData>();

    const onSubmit = async (data: depositData) => {
        try {
            await deposit(data.userId, data.amount);

            alert('top up succesful!');
            reset({
                userId: '',
                amount: 0,
              });
        } catch(e: any) {
            alert(e.response.data.message);
        }
    };

    return (
        <>
        <Container>
        <Row className="justify-content-md-center">
            <Col xs={12} md={6}>
            <h1 className="m-5">Top Up</h1>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group controlId="formBasicUserId">
                <Form.Label className="my-3">User ID</Form.Label>
                <Controller
                    name="userId"
                    control={control}
                    rules={{
                    required: "user ID is required",
                    }}
                    render={({ field }) => (
                    <Form.Control
                        type="text"
                        placeholder="Enter user ID"
                        {...field}
                    />
                    )}
                />
                {errors.userId && (
                    <span className="text-danger">{errors.userId.message}</span>
                )}
                </Form.Group>

                <Form.Group controlId="formBasicAmount">
                <Form.Label className="my-3">Amount</Form.Label>
                <Controller
                    name="amount"
                    control={control}
                    rules={{
                    required: "Amount is required"
                    }}
                    render={({ field }) => (
                    <Form.Control
                        type="number"
                        placeholder="Amount"
                        {...field}
                    />
                    )}
                />
                {errors.amount && (
                    <span className="text-danger">{errors.amount.message}</span>
                )}
                </Form.Group>

                <Button variant="primary" type="submit"
                className="my-3"
                >
                Deposit
                </Button>
            </Form>
            </Col>
        </Row>
        </Container>
    </>
    )
}