import React from "react";
import { setCookie } from 'typescript-cookie'
import { useForm, Controller } from "react-hook-form";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate  } from 'react-router-dom';
import { signIn } from "../api_calls";

interface SignInData {
  email: string;
  password: string;
}

export const SignIn: React.FC = () => {
    const {
        control,
        handleSubmit,
        formState: { errors },
        watch,
        reset
    } = useForm<SignInData>();

    const navigate = useNavigate();

    const onSubmit = async (data: SignInData) => {
        try {
            const session = await signIn(data.email, data.password);
            setCookie('bearerToken', session.token, { expires: 30 });

            alert('succesful login!');
            navigate('/');
        } catch(error: any) {
            if (error.response.data.error_code === 'PASSWORD_NOT_MATCH') {
                alert('wrong password!');
                reset();
            } else {
                navigate('/error');
            }
        }
    };

    async function toSignUp () {
        navigate('/sign-up');
    }

  return (
    <>
        <Container>
        <Row className="justify-content-md-center">
            <Col xs={12} md={6}>
            <h1 className="m-5">Sign In</h1>
            <h3 className="m-5">New User? <Button onClick={toSignUp}>Sign Up</Button> Here</h3>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group controlId="formBasicEmail">
                <Form.Label className="my-3">Email address</Form.Label>
                <Controller
                    name="email"
                    control={control}
                    defaultValue=""
                    rules={{
                    required: "Email is required",
                    pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                    },
                    }}
                    render={({ field }) => (
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        {...field}
                    />
                    )}
                />
                {errors.email && (
                    <span className="text-danger">{errors.email.message}</span>
                )}
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                <Form.Label className="my-3">Password</Form.Label>
                <Controller
                    name="password"
                    control={control}
                    defaultValue=""
                    rules={{
                    required: "Password is required"
                    }}
                    render={({ field }) => (
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        {...field}
                    />
                    )}
                />
                {errors.password && (
                    <span className="text-danger">{errors.password.message}</span>
                )}
                </Form.Group>

                <Button variant="primary" type="submit"
                className="my-3"
                >
                Sign In
                </Button>
            </Form>
            </Col>
        </Row>
        </Container>
    </>
  );
};
