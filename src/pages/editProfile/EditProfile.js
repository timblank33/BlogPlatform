import React, { useEffect } from 'react';

import classes from './editProfile.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { fetchEditProfile } from '../../store/loginSlice';
import { useNavigate } from 'react-router-dom';

export default function EditProfile() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const { token, loginError, username, email, image } = useSelector(
    (state) => state.login.user || 0
  );
  const { statusEdit, imgError } = useSelector((state) => state.login);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userName = watch().userName;
  const emailAdress = watch().emailAdress;
  const password = watch().password;
  const avatarImage = watch().avatarImage;

  useEffect(() => {
    if (imgError) {
      dispatch(
        fetchEditProfile({
          username: userName,
          email: emailAdress,
          password: password,
          image:
            'https://junior3d.ru/wp-content/themes/3d/assets/img/no-image.gif',
          token,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, imgError]);

  return (
    <form
      onSubmit={handleSubmit((data) => {
        dispatch(
          fetchEditProfile({
            username: userName,
            email: emailAdress,
            password: password,
            image:
              avatarImage ||
              'https://junior3d.ru/wp-content/themes/3d/assets/img/no-image.gif',
            token,
          })
        );
        setTimeout(() => {
          navigate(`/`);
        }, 1000);
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
          defaultValue={username}
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
          defaultValue={email}
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
              value: /^http[s]*:\/*/,
              message: 'You can only use format https://www.image.ru./img.jpg',
            },
          })}
          className={classes['create-input']}
          type="text"
          placeholder="Avatar image"
          defaultValue={
            image ===
            'https://junior3d.ru/wp-content/themes/3d/assets/img/no-image.gif'
              ? ''
              : image
          }
        />
        <p className={classes['error-message']}>
          {errors.avatarImage?.message}
        </p>
        {imgError ? (
          <p className={classes['error-message']}>Image not found</p>
        ) : null}
      </div>

      <input
        type="submit"
        className={classes['create-submit']}
        value={'Save'}
      />
      {statusEdit === 'resolved' ? (
        <p className={classes['success-message']}>Confirm</p>
      ) : null}
    </form>
  );
}
