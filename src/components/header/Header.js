import React, { useEffect } from 'react';
import classes from './header.module.scss';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { logOutUser } from '../../store/loginSlice';
import { clearSuccess } from '../../store/articleSlice';
import { useDispatch } from 'react-redux';
import { clearEdit, imageError } from '../../store/loginSlice';
import { clearOpened } from '../../store/articleSlice';

export default function Header() {
  const { user } = useSelector((state) => state.login);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    dispatch(clearEdit());
    dispatch(clearOpened());
    dispatch(imageError(false));
  }, [dispatch, location.pathname]);

  const formatImage = (url) => {
    return url && url.image?.length > 10
      ? url.image
      : 'https://junior3d.ru/wp-content/themes/3d/assets/img/no-image.gif';
  };

  const guest = (
    <React.Fragment>
      <Link to="/" className={classes['header-logo']}>
        Realworld Blog
      </Link>
      <div className={classes['header-btns']}>
        <Link to="sign-in">
          <button className={`${classes['btn']} ${classes['sign-in']}`}>
            Sign In
          </button>
        </Link>
        <Link to="create-account">
          <button className={`${classes['btn']} ${classes['sign-up']}`}>
            Sign Up
          </button>
        </Link>
      </div>
    </React.Fragment>
  );
  const loginIn = (
    <React.Fragment>
      <Link to="/" className={classes['header-logo']}>
        Realworld Blog
      </Link>
      <div className={classes['header-btns__login']}>
        <Link to="new-article">
          <button
            className={`${classes['btn']} ${classes['create-article']}`}
            onClick={() => clearSuccess()}
          >
            Create article
          </button>
        </Link>

        <Link to="profile">
          <div className={classes['user-info']}>
            <p>{user?.username}</p>
            <img
              className={classes['user-image']}
              src={formatImage(user)}
              alt="logo"
              width={'46px'}
              height={'46px'}
              onError={(err) => {
                err.target.src =
                  'https://junior3d.ru/wp-content/themes/3d/assets/img/no-image.gif';
                dispatch(imageError(true));
              }}
            />
          </div>
        </Link>
        <Link to="/">
          <button
            className={`${classes['btn']} ${classes['log-out']}`}
            onClick={() => dispatch(logOutUser())}
          >
            Log Out
          </button>
        </Link>
      </div>
    </React.Fragment>
  );
  return (
    <header className={classes['header']}>{!user ? guest : loginIn}</header>
  );
}
