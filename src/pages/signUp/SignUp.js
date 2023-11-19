import React from 'react';
import classes from './signUp.module.scss';
import { fetchRegistration } from '../../store/registrationSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

export default function SignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const dispatch = useDispatch();
  const userName = watch().userName;
  const emailAdress = watch().emailAdress;
  const password = watch().password;
  const onRegistrated = useSelector((state) => state.registration);

  return (
    <form
      onSubmit={handleSubmit((data) => {
        if (watch().checkBox === true) {
          dispatch(
            fetchRegistration({
              username: userName,
              email: emailAdress,
              password: password,
            })
          );
        }
      })}
      className={classes['create-acc']}
    >
      <p className={classes['create-title']}>Create new account</p>
      <div className={classes['create-acc__input']}>
        <label className={classes['create-label']}>Username</label>
        <input
          {...register('userName', {
            required: 'This is required',
            minLength: {
              value: 3,
              message: 'Your username needs to be at least 3 characters.',
            },
            maxLength: {
              value: 20,
              message: 'Maximum 20 characters.',
            },
            pattern: {
              value: /^[a-z\d]*$/,
              message: 'You can only use lowercase English letters and numbers',
            },
          })}
          className={classes['create-input']}
          type="text"
          placeholder="Username"
        />
        <p className={classes['error-message']}>
          {errors.userName?.message || onRegistrated.errors?.username}
        </p>
      </div>
      <div className={classes['create-acc__input']}>
        <label className={classes['create-label']}>Email address</label>
        <input
          {...register('emailAdress', {
            required: 'This is required',
            minLength: {
              value: 5,
              message: 'Your email-adress needs to be at least 6 characters.',
            },
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
          {errors.emailAdress?.message || onRegistrated.errors?.email}
        </p>
      </div>
      <div className={classes['create-acc__input']}>
        <label className={classes['create-label']}>Password</label>
        <input
          {...register('password', {
            required: 'Needs password',
            minLength: {
              value: 6,
              message: 'Your password needs to be at least 6 characters.',
            },
            maxLength: {
              value: 40,
              message: 'Maximum 40 characters.',
            },
          })}
          className={classes['create-input']}
          type="text"
          placeholder="Password"
        />
        <p className={classes['error-message']}>{errors.password?.message}</p>
      </div>
      <div className={classes['create-acc__input']}>
        <label className={classes['create-label']}>Repeat Password</label>
        <input
          {...register('repeatPassword', {
            required: 'Repeat your password',
          })}
          className={classes['create-input']}
          type="text"
          placeholder="Password"
        />
        <p className={classes['error-message']}>
          {watch().repeatPassword !== watch().password
            ? 'Passwords must match'
            : errors.repeatPassword?.message}
        </p>
      </div>
      <div className={classes['checkbox-accept']}>
        <input
          {...register('checkBox')}
          className={classes['create-input-checkbox']}
          type="checkBox"
        />
        <label className={classes['create-label-checkbox']}>
          I agree to the processing of my personal information
        </label>
        <p className={classes['error-message']}>
          {watch().checkBox === false && userName
            ? 'Need to check the box'
            : null}
        </p>
      </div>

      <input
        type="submit"
        className={classes['create-submit']}
        value={'Create'}
      />
      <p className={classes['create-text']}>
        Already have an account?{' '}
        <Link to={`/sign-in`}>
          <span className={classes['text-link']}>Sign In.</span>
        </Link>
      </p>
    </form>
  );
}
