import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import { removeCredentials } from '../slices/usersSlice.js';
import useAuth from '../hooks/index.jsx';

const NavbarPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const token = useSelector((state) => state.users.token);
  const auth = useAuth();
  const { t, i18n } = useTranslation();

  const handleLogout = () => {
    dispatch(removeCredentials);
    auth.loggedIn = false;
    return navigate('login');
  }

  return <>
      <Navbar bg="white" data-bs-theme="light" className="shadow-lg justify-content-between">
        <Container>
          <Nav className="me-auto">
            <a class="navbar-brand" href="/">
              Hexlet Chat
            </a>

            <Button type="button" onClick={() => i18n.changeLanguage('en')}>EN</Button>
            <Button type="button" onClick={() => i18n.changeLanguage('ru')}>RU</Button>
          </Nav>
          <Nav className="me-auto">
            {token && <Button type="button" onClick={handleLogout} className="btn btn-primary">
              {t('Logout')}
            </Button>}
          </Nav>
        </Container>
      </Navbar>
    </>
}

export default NavbarPage;

