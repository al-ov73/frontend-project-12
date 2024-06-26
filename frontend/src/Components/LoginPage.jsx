import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useDispatch } from 'react-redux'
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { toast, ToastContainer } from 'react-toastify';
import { FormikProvider, useFormik, ErrorMessage } from "formik";
import * as Yup from 'yup';
import axios from 'axios';

import NavbarPage from './Navbar.jsx';
import routes from '../routes/routes.js';
import hexletImage from '../images/LoginForm.jpg';
import { setCredentials } from '../slices/usersSlice.js';
import useAuth from '../hooks/index.jsx';


const LoginPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const auth = useAuth();
  const { t } = useTranslation();

  const SignupSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, t('forms.From3To20Symbols'))
      .max(20, t('forms.From3To20Symbols'))
      .required(t('forms.RequiredField')),
    password: Yup.string().min(2, t('forms.MoreThen6Symbols')),
  });

  const handleSubmit = (values, actions) => async () => {
    try {
      const response = await axios.post(routes.loginPath(), {
        username: values.username,
        password: values.password
      });
      const { token, username } = response.data;
      if (token) {
        localStorage.setItem('user', JSON.stringify({ token, username }))
        dispatch(setCredentials({ token, username }))
        auth.loggedIn = true;
        toast.success(t('toasts.LoginSuccess'));
        return navigate('/');
      }
    } catch (e) {
      if (e.message === "Network Error") {
        toast.warn(t('toasts.NetworkError'));
      }
      if (e.message === "Request failed with status code 401") {
        console.log('forms.IncorrectUsernameOrPassword')
        actions.setFieldError('password', t('forms.IncorrectUsernameOrPassword'))
      }
      console.log('e', e);
    }
  };
  
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: SignupSchema,
    onSubmit: (values, actions) => dispatch(handleSubmit(values, actions)),
  });

  return <>
    <ToastContainer />
    <div class='d-flex flex-column h-100'>
      <NavbarPage />

      <div className='container-fluid h-100'>
        <div className='row justify-content-center align-content-center h-100'>
          <div className='col-12 col-md-8 col-xxl-6'>
            <div className='card shadow-sm'>
              <div className='card-body row p-5'>
                <div className='col-12 col-md-6 d-flex align-items-center justify-content-center'>
                  <img src={hexletImage} className='rounded-circle' alt='Войти' />
                  <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
                </div>
                <FormikProvider value={formik}>
                  <Form onSubmit={formik.handleSubmit} className="col-12 col-md-6 mt-3 mt-mb-0">
                    <h1 className="text-center mb-4">{t('Login')}</h1>
                    <Form.Group className="form-floating mb-3">
                    <Form.Control
                      autoComplete="username"
                      id="username"
                      onChange={formik.handleChange}
                      value={formik.values.username}
                      />
                    <Form.Label htmlFor='username' >{t('Your_nick')}</Form.Label>
                    <ErrorMessage component="div" name="username" />
                    </Form.Group>

                    <Form.Group className="form-floating mb-3" >
                    <Form.Control type="password"
                      id="password"
                      autoComplete="password"
                      onChange={formik.handleChange}
                      value={formik.values.password} />
                    <Form.Label htmlFor='password' >{t('Password')}</Form.Label>  
                    <ErrorMessage component="div" name="password" />
                    </Form.Group>
                    <Button type="submit">{t('Login')}</Button>
                  </Form>
                  </FormikProvider>
              </div>
          </div>
            <div className="card-footer p-4">
              <div className="text-center">
                <span>{t('NoAccount?')} </span>
                  <a href="/signup">{t('Registration')}</a>
              </div>
            </div>
          </div>
        </div>
      </div>
  </div>
  </>
};

export default LoginPage;
