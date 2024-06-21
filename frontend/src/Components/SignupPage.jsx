//TODO
// English language

import React from 'react';
import { FormikProvider, useFormik, ErrorMessage } from "formik";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import * as Yup from 'yup';
import axios from 'axios';
import routes from '../routes/routes.js';
import hexletImage from '../images/LoginForm.jpg';
import { useDispatch } from 'react-redux'
import { setCredentials } from '../slices/usersSlice.js';
import { useNavigate } from "react-router-dom";
import useAuth from '../hooks/index.jsx';
import { toast, ToastContainer } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import NavbarPage from './Navbar.jsx';

const SignupPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const auth = useAuth();
  const { t } = useTranslation();

  const SignupSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, t('forms.From3To20Symbols'))
      .max(20, t('forms.From3To20Symbols'))
      .required(t('forms.RequiredField')),
    password: Yup.string().min(6, t('forms.MoreThen6Symbols')),
    passwordConfirmation: Yup.string()
      .oneOf([Yup.ref('password'), null], t('forms.PasswordsShouldMatch'))
  });

  const handleSubmit = (values, actions) => async () => {
    try {
      const response = await axios.post(routes.signupPath(), {
        username: values.username,
        password: values.password,
      });
      const { token, username } = response.data;
      if (token) {
        dispatch(setCredentials({ token, username }))
        auth.loggedIn = true;
        toast.success(t('toasts.SignupSuccess'));
        return navigate('/');
      }
    } catch (e) {
      if (e.response.request.status === 409) {
        actions.setFieldError('username', t('forms.UserAlreadyExist'))
      }
      if (e.message === "Network Error") {
        toast.warn(t('toasts.NetworkError'));
      }
      console.log('e', e);
    }
  };
  
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      passwordConfirmation: '',
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
                  <img src={hexletImage} className='rounded-circle' alt={t('Login')} />
                  <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
                </div>
                <FormikProvider value={formik}>
                  <Form onSubmit={formik.handleSubmit}>
                      <h1 className="text-center mb-4">{t('Login')}</h1>
                      <Form.Group className="mb-3">
                      <Form.Label htmlFor="username">{t('User_name')}</Form.Label>
                        <Form.Control type="text"
                          placeholder="{t('User_name')}"
                          autoComplete="username"
                          id="username"
                          onChange={formik.handleChange}
                          value={formik.values.username}
                          />
                      <ErrorMessage name="username" />
                    </Form.Group>

                    <Form.Group className="mb-3" >
                      <Form.Label htmlFor="password">{t('Password')}</Form.Label>
                      <Form.Control type="password"
                        placeholder={t('Password')}
                        id="password"
                        autoComplete="password"
                        onChange={formik.handleChange}
                        value={formik.values.password} />
                      <ErrorMessage name="password" />
                    </Form.Group>

                    <Form.Group className="mb-3" >
                      <Form.Label htmlFor="passwordConfirmation">{t('Confirm_password')}</Form.Label>
                      <Form.Control type="password"
                        placeholder={t('Confirm_password')}
                        id="passwordConfirmation"
                        autoComplete="passwordConfirmation"
                        onChange={formik.handleChange}
                        value={formik.values.passwordConfirmation} />
                      <ErrorMessage name="passwordConfirmation" />
                    </Form.Group>

                    <Button type="submit">
                      {t('Register')}
                    </Button>
                  </Form>
                </FormikProvider>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
};

export default SignupPage;
