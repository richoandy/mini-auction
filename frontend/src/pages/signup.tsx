import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate  } from 'react-router-dom';
import { signUp } from "../api_calls";

interface SignUpData {
  email: string;
  password: string;
  confirmPassword: string;
};

export const SignUp: React.FC = () => {
    const {
        control,    
        handleSubmit,
        formState: { errors },
        watch
    } = useForm<SignUpData>();

    const navigate = useNavigate();

    const onSubmit = async (data: SignUpData) => {
        try {
            await signUp(data.email, data.password);
            alert('succesful registration!');
            navigate('/sign-in');
        } catch(e) {
            navigate('/error');
        }
    };

  const password = watch("password", "");

  async function toSignIn () {
    navigate('/sign-in');
}

  return (
    <>
        <Container>
        <Row className="justify-content-md-center">
            <Col xs={12} md={6}>
            <h1 className="m-5">Sign Up</h1>
            <h3 className="m-5">Already a User? <Button onClick={toSignIn}>Sign In</Button> Here</h3>
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
                    required: "Password is required",
                    minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters long",
                    },
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

                <Form.Group controlId="formBasicConfirmPassword">
                <Form.Label className="my-3">Confirm Password</Form.Label>
                <Controller
                    name="confirmPassword"
                    control={control}
                    defaultValue=""
                    rules={{
                    required: "Please confirm your password",
                    validate: (value) =>
                        value === password || "Passwords does not match",
                    }}
                    render={({ field }) => (
                    <Form.Control
                        type="password"
                        placeholder="Confirm Password"
                        {...field}
                    />
                    )}
                />
                {errors.confirmPassword && (
                    <span className="text-danger">
                    {errors.confirmPassword.message}
                    </span>
                )}
                </Form.Group>

                <Button variant="primary" type="submit"
                className="my-3"
                >
                Sign Up
                </Button>
            </Form>
            </Col>
        </Row>
        </Container>
    </>
  );
};
