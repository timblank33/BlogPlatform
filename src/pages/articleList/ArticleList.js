import React, { useEffect } from 'react';
import classes from './articleList.module.scss';
import Article from '../../components/article';
import { useDispatch, useSelector } from 'react-redux';
import { nanoid } from 'nanoid';
import { fetchList } from '../../store/articleSlice';

export default function ArticleList() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.login);
  const { pageNumber } = useSelector((state) => state.list);
  useEffect(() => {
    dispatch(
      fetchList({
        token: user?.token,
        number:
          (+localStorage.getItem('pageNumber') - 1) * 5 > 0
            ? (+localStorage.getItem('pageNumber') - 1) * 5
            : 0,
      })
    );
  }, [dispatch, pageNumber, user?.token]);

  const articles = useSelector((state) => state.list.fetchProps.articles);
  window.scrollTo(0, 0);
  return (
    <div className={classes['article-list']}>
      {articles.map((article) => {
        const id = nanoid();
        return <Article {...article} key={id} />;
      })}
    </div>
  );
}
