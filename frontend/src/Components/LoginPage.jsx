import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const SignupSchema = Yup.object().shape({
    userName: Yup.string()
      .min(2, 'Минимум 2 буквы')
      .max(50, 'Максимум 50 букв')
      .required('Обязательное поле'),
    password: Yup.string().min(3, 'Минимум 3 символа'),
  });

const LoginPage = () => (
  <div className='container-fluid h-100'>
  <div className='row justify-content-center align-content-center h-100'>
  <div className='col-12 col-md-8 col-xxl-6'>
  <div className='card shadow-sm'>
    <div className='card-body row p-5'>
      <div className='col-12 col-md-6 d-flex align-items-center justify-content-center'>
        <img src='frontend/public/LoginForm.jpg' className='rounded-circle' alt='Войти' />
      </div>
        <h1 className='text-center mb-4'>Войти</h1>
        <Formik
        initialValues={{
            userName: '',
            password: '',
        }}
        validationSchema={SignupSchema}
        onSubmit={(values, { setSubmitting }) => {
          console.log(JSON.stringify(values, null, 2));
          setSubmitting(false);
        }}
        >
        {({ errors, touched }) => (
            <Form>
              <div className='form-floating mb-3'>
                <Field name="userName" autoComplete="username" className='form-control' placeholder="Ваш ник" id="username" />
            {errors.userName && touched.userName ? (
                <div>{errors.userName}</div>
            ) : null}
              <label className="form-label" htmlFor="username">Ваш ник</label>
              </div>
              <div className='form-floating mb-3'>
            <Field name="password" autoComplete="password" className='form-control' placeholder="Пароль" id="password" />
            {errors.password && touched.password ? (
                <div>{errors.password}</div>
            ) : null}
            <label className="form-label" htmlFor="password">Пароль</label>
            </div>
            <button type="submit" className='w-100 mb-3 btn btn-outline-primary'>Submit</button>
            </Form>
        )}
        </Formik>
      </div>
    </div>
    </div>
    </div>
    </div>

  );

export default LoginPage;
