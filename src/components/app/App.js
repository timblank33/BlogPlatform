import React, { useEffect } from 'react';
import classes from './app.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { currentPage } from '../../store/articleSlice';
import { Pagination } from 'antd';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from '../header';
import ArticleList from '../../pages/articleList';
import ArticleDetails from '../../pages/articleDetails';
import SignUp from '../../pages/signUp/SignUp';
import SignIn from '../../pages/signIn/SignIn';
import EditProfile from '../../pages/editProfile';
import CreateNewArticle from '../../pages/createNewArticle';
import EditArticle from '../../pages/editArticle';
import { localStorageSave } from '../../store/loginSlice';

function App() {
  const { error, fetchProps, opened, pageNumber } = useSelector(
    (state) => state.list
  );
  const { user } = useSelector((state) => state.login);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(localStorageSave(localStorage.getItem('user')));
  }, [dispatch]);

  const articlesRender = (
    <React.Fragment>
      <ArticleList />
      <div className={classes['pagination']}>
        <Pagination
          current={+localStorage.getItem('pageNumber') || pageNumber}
          defaultPageSize={5}
          total={fetchProps.articlesCount}
          showSizeChanger={false}
          onChange={(page) => {
            dispatch(currentPage(page));
          }}
        />
      </div>
    </React.Fragment>
  );
  return (
    <BrowserRouter>
      <div className={classes['main']}>
        <Header />
        {error && <p>{error}</p>}
        <Routes>
          <Route
            path="create-account"
            element={!user ? <SignUp /> : <Navigate to="/" />}
          />
          <Route
            path="sign-in"
            element={!user ? <SignIn /> : <Navigate to="/" />}
          />
          <Route
            path="new-article"
            element={
              localStorage.getItem('user') ? (
                <CreateNewArticle />
              ) : (
                <Navigate to="/sign-in" />
              )
            }
          />
          <Route
            path="profile"
            element={
              localStorage.getItem('user') ? (
                <EditProfile />
              ) : (
                <Navigate to="/sign-in" />
              )
            }
          />
          <Route path="/" element={articlesRender} />
          <Route path={`/:id`} element={<ArticleDetails />} />
          <Route
            path={`/:id/edit`}
            element={
              localStorage.getItem('user') ? (
                <EditArticle article={opened?.article} />
              ) : (
                <Navigate to="/sign-in" />
              )
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
