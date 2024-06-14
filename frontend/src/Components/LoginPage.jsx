// TODO Доделать интернационализацию
import React from 'react';
import { FormikProvider, useFormik, ErrorMessage } from "formik";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import * as Yup from 'yup';
import axios from 'axios';
import routes from '../routes/routes.js';
import hexletImage from '../images/LoginForm.jpg';
import { useDispatch, useSelector } from 'react-redux'
import { setCredentials } from '../slices/usersSlice.js';
import { useNavigate } from "react-router-dom";
import useAuth from '../hooks/index.jsx';
import { useTranslation } from 'react-i18next';
import { toast, ToastContainer } from 'react-toastify';

const LoginPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const auth = useAuth();
  const { t, i18n } = useTranslation();

  const LoginSchema = Yup.object().shape({
    username: Yup.string()
      .min(2, 'Минимум 2 буквы')
      .max(50, 'Максимум 50 букв')
      .required('Обязательное поле'),
    password: Yup.string().min(3, 'Минимум 3 символа'),
  });

  const handleSubmit = (values, actions) => async () => {
    try {
      const response = await axios.post(routes.loginPath(), {
        username: values.username,
        password: values.password
      });
      const { token, username } = response.data;
      if (token) {
        dispatch(setCredentials({ token, username }))
        auth.loggedIn = true;
        toast.success(t('toasts.LoginSuccess'));
        return navigate('/');
      }
      else {
        actions.setErrors('Неверный логин')
      }
    } catch (e) {
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
    },
    validationSchema:LoginSchema,
    onSubmit: (values, actions) => dispatch(handleSubmit(values, actions)),
  });

  return <>
    <ToastContainer />
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
              <Form onSubmit={formik.handleSubmit}>
                  <h1 className="text-center mb-4">Войти</h1>
                  <Form.Group className="mb-3">
                  <Form.Label>Ваш Ник</Form.Label>
                    <Form.Control type="text"
                      placeholder="Ваш ник"
                      autoComplete="username"
                      id="username"
                      onChange={formik.handleChange}
                      value={formik.values.username}
                      />
                  <ErrorMessage name="username" />
                </Form.Group>

                <Form.Group className="mb-3" >
                  <Form.Label>Пароль</Form.Label>
                  <Form.Control type="password"
                    placeholder='Пароль'
                    id="password"
                    autoComplete="password"
                    onChange={formik.handleChange}
                    value={formik.values.password} />
                  <ErrorMessage name="password" />
                </Form.Group>

                <Button type="submit">
                  Войти
                </Button>
              </Form>

              </FormikProvider>
          </div>
        </div>
        <div className="card-footer p-4">
          <div className="text-center">
            <span>Нет аккаунта? </span>
              <a href="/signup">Регистрация</a>
          </div>
        </div>
      </div>
    </div>
  </div>
  </>
};

export default LoginPage;
