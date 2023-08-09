import { Container, Navbar, Nav } from 'react-bootstrap';
import { useNavigate  } from 'react-router-dom';
import { removeCookie } from 'typescript-cookie'

export const MyNavbar: React.FC = () => {
    const navigate = useNavigate();

    function toAddProduct() {
        navigate('/add-product');
    }
    
    function toHome() {
        navigate('/');
    }

    function loggingOut() {
        removeCookie('bearerToken');
        alert('see you!');
        navigate('/sign-in');
    }

    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand onClick={toHome}>Mini Auction</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link onClick={toAddProduct}>Add Product</Nav.Link>
                    <Nav.Link onClick={loggingOut}>Logout</Nav.Link>
                </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}