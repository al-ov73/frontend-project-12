import React from 'react';
import { useFormik } from 'formik';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import * as Yup from 'yup';
import axios from 'axios';
import routes from '../routes/routes.js';
import hexletImage from '../images/LoginForm.jpg';
import store from '../slices/index.js';
import { useDispatch, useSelector } from 'react-redux'
import { setCredentials } from '../slices/usersSlice.js';
import { redirect } from "react-router-dom";

const SignupSchema = Yup.object().shape({
    username: Yup.string()
      .min(2, 'Минимум 2 буквы')
      .max(50, 'Максимум 50 букв')
      .required('Обязательное поле'),
    password: Yup.string().min(3, 'Минимум 3 символа'),
  });

const LoginPage = () => {
  const dispatch = useDispatch()
  
  const handleSubmit = (values) => async () => {
    try {
      const response = await axios.post(routes.loginPath(), {
        username: values.username,
        password: values.password
      });
      const { token, username } = response.data;
      if (token) {
        console.log('начальный стор', store.getState())
        dispatch(setCredentials({ token, username }))
        console.log('конечный стор', store.getState())
        return redirect("/");
      }
    } catch (e) {
      console.log(e);
    }
  };
  
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema:SignupSchema,
    onSubmit: (values) => dispatch(handleSubmit(values)),
  });

  return (
  <div className='container-fluid h-100'>
    <div className='row justify-content-center align-content-center h-100'>
      <div className='col-12 col-md-8 col-xxl-6'>
        <div className='card shadow-sm'>
          <div className='card-body row p-5'>
            <div className='col-12 col-md-6 d-flex align-items-center justify-content-center'>
              <img src={hexletImage} className='rounded-circle' alt='Войти' />
              <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
            </div>
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
                </Form.Group>

                <Form.Group className="mb-3" >
                  <Form.Label>Пароль</Form.Label>
                  <Form.Control type="password" /* Изменено на password */
                    placeholder='Пароль'
                    id="password"
                    autoComplete="password"
                    onChange={formik.handleChange}
                    value={formik.values.password} />
                </Form.Group>

                <Button type="submit">
                  Войти
                </Button>
              </Form>
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
  )
};

export default LoginPage;
