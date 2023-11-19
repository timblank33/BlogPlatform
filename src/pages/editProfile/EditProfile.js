import React from 'react';

import classes from './editProfile.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { fetchEditProfile } from '../../store/loginSlice';

export default function EditProfile() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const { token, loginError } = useSelector((state) => state.login.user || 0);

  const dispatch = useDispatch();
  const userName = watch().userName;
  const emailAdress = watch().emailAdress;
  const password = watch().password;
  const avatarImage = watch().avatarImage;

  return (
    <form
      onSubmit={handleSubmit((data) => {
        dispatch(
          fetchEditProfile({
            username: userName,
            email: emailAdress,
            password: password,
            image: avatarImage,
            token,
          })
        );
      })}
      className={classes['create-acc']}
    >
      <p className={classes['create-title']}>Edit Profile</p>
      <div className={classes['create-acc__input']}>
        <label className={classes['create-label']}>Username</label>
        <input
          {...register('userName', {
            required: 'This is required',
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
          {errors.userName?.message || loginError?.username}
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
          {errors.emailAdress?.message || loginError?.email}
        </p>
      </div>
      <div className={classes['create-acc__input']}>
        <label className={classes['create-label']}>New password</label>
        <input
          {...register('password', {
            required: 'Enter new password',
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
          placeholder="New password"
        />
        <p className={classes['error-message']}>{errors.password?.message}</p>
      </div>
      <div className={classes['create-acc__input']}>
        <label className={classes['create-label']}>Avatar image (url)</label>
        <input
          {...register('avatarImage', {
            required: 'Enter avatar image',
            pattern: {
              value: /^https:\/*/,
              message: 'You can only use format https://www.image.ru./img.jpg',
            },
          })}
          className={classes['create-input']}
          type="text"
          placeholder="Avatar image"
        />
        <p className={classes['error-message']}>
          {errors.avatarImage?.message}
        </p>
      </div>

      <input
        type="submit"
        className={classes['create-submit']}
        value={'Save'}
      />
    </form>
  );
}
