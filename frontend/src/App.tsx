import { Routes, Route, useLocation } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { Home } from './pages/home';
import { SignIn } from './pages/signin';
import { SignUp } from './pages/signup';
import { AddProduct } from './pages/add_product';
import { TopUp } from './pages/top_up';
import { ErrorPage } from './pages/error';
import { MyNavbar } from './components/navbar';

const App: React.FC = () => {
  const location = useLocation();
  const showNavbar = location.pathname !== "/sign-in"
  && location.pathname !== "/sign-up"
  && location.pathname !== "/error";

  return (
      <Container>
        {showNavbar && <MyNavbar />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/top-up" element={<TopUp />} />
          <Route path="/error" element={<ErrorPage />} />
        </Routes>
      </Container>
  );
};

export default App;