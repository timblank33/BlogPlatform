import React, { useEffect } from 'react';
import classes from './articleList.module.scss';
import Article from '../../components/article';
import { useDispatch, useSelector } from 'react-redux';
import { nanoid } from 'nanoid';
import { fetchList, clearOpened } from '../../store/articleSlice';
import { useLocation } from 'react-router-dom';

export default function ArticleList() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.login);
  const { pageNumber } = useSelector((state) => state.list);
  useEffect(() => {
    dispatch(clearOpened());
    dispatch(fetchList({ token: user?.token, number: (pageNumber - 1) * 5 }));
  }, [dispatch, location.pathname, pageNumber, user?.token]);

  const articles = useSelector((state) => state.list.fetchProps.articles);

  return (
    <div className={classes['article-list']}>
      {articles.map((article) => {
        const id = nanoid();
        return <Article {...article} key={id} />;
      })}
    </div>
  );
}
