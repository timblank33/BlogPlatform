import React, { useEffect } from 'react';
import classes from './signIn.module.scss';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLogin } from '../../store/loginSlice';
import { clearStatusUp } from '../../store/registrationSlice';

export default function SignIn() {
  useEffect(() => {
    dispatch(clearStatusUp());
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const loginInfo = useSelector((state) => state.login);

  const dispatch = useDispatch();
  return (
    <form
      onSubmit={handleSubmit((data) => {
        dispatch(
          fetchLogin({ email: data.emailAdress, password: data.password })
        );
      })}
      className={classes['create-acc']}
    >
      <p className={classes['create-title']}>Sign In</p>

      <div className={classes['create-acc__input']}>
        <label className={classes['create-label']}>Email address</label>
        <input
          {...register('emailAdress', {
            required: 'This is required',
            pattern: {
              value: /^[a-z\d]*@[a-z\d]*\.[a-z]+$/,
              message:
                'Not validate email adress. You can only use lowercase English letters and numbers',
            },
          })}
          className={classes['create-input']}
          type="text"
          placeholder="Email address"
        />
        <p className={classes['error-message']}>
          {errors.emailAdress?.message}
        </p>
      </div>
      <div className={classes['create-acc__input']}>
        <label className={classes['create-label']}>Password</label>
        <input
          {...register('password', {
            required: 'This is required',
          })}
          className={classes['create-input']}
          type="password"
          placeholder="Password"
          autoComplete="on"
        />
        <p className={classes['error-message']}>{errors.password?.message}</p>
      </div>
      <p className={classes['error-message']}>
        {loginInfo.errors
          ? JSON.stringify(loginInfo.errors)
              .replaceAll('{"', '')
              .replaceAll('":"', ' ')
              .replaceAll('"}', '')
          : null}
      </p>

      <input
        type="submit"
        className={classes['create-submit']}
        value={'Login'}
      />

      <p className={classes['create-text']}>
        Don’t have an account?
        <Link to="/create-account">
          <span className={classes['text-link']}> Sign Up.</span>
        </Link>
      </p>
    </form>
  );
}
