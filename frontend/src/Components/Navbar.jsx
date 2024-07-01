import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
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
  const { token, username } = useSelector((state) => state.users);
  const auth = useAuth();
  const { t, i18n } = useTranslation();
  const [currentLanguage, setLanguage] = useState('ru');
  const languages = [
    {name: 'ru', text: 'RU'},
    {name: 'en', text: 'EN'},
  ];
  const handleLogout = () => {
    dispatch(removeCredentials());
    auth.logOut();
    localStorage.removeItem('user');
    return navigate('login');
  }

  const handleChangeLanguage = (lang) => {
    setLanguage(lang)
    i18n.changeLanguage(lang);
  }

  return <>
      <Navbar bg="white" data-bs-theme="light" className="shadow-lg justify-content-between">
        <Container>
          <Nav>
            <a class="navbar-brand" href="/">
              Hexlet Chat
            </a>
          </Nav>
          <Nav className="justify-content-center">
            {languages.map((language) => {
              return <Button variant={language.name === currentLanguage ? 'secondary' : 'outline-secondary'}
                      size="sm"
                      type="button"
                      onClick={() => handleChangeLanguage(language.name)}>
                      {language.text}
                    </Button> 
            })}
          </Nav>
          <Nav className="justify-content-end">
            {token && <>
              <Navbar.Text className="me-3">{t('YouEnteredAs')}: {username}</Navbar.Text>
              <Button type="button" onClick={() => handleLogout()} variant='secondary'>
                {t('Logout')}
              </Button></>}
          </Nav>
        </Container>
      </Navbar>
    </>
}

export default NavbarPage;

