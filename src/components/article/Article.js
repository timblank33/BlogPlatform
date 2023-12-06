import React from 'react';
import classes from './article.module.scss';
import likesImg from '../../assets/likes.svg';
import noImage from '../../assets/no-image.gif';
import { format } from 'date-fns';
import { nanoid } from 'nanoid';
import { Link } from 'react-router-dom';
import { fetchFavoriteArticle } from '../../store/articleSlice';
import { useDispatch, useSelector } from 'react-redux';
import { FallingLines } from 'react-loader-spinner';

export default function Article({
  slug,
  title,
  description,
  tagList,
  createdAt = 0,
  favoritesCount,
  favorited,
  author = 0,
}) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.login);
  const { status } = useSelector((state) => state.list);
  const formatDate = format(new Date(createdAt), 'MMMM d, yyyy');
  const spinner = (
    <FallingLines
      color="#4fa94d"
      width="40"
      height="20"
      visible={true}
      ariaLabel="falling-lines-loading"
    />
  );

  const formatText = (text) => {
    if (text && text.length > 280) {
      return text.slice(0, 280) + '...';
    }
    return text;
  };

  return (
    <div className={classes['article']}>
      <div className={classes['article-title']}>
        <Link to={`/${slug}`}>
          {status !== 'resolved' ? spinner : <h5>{formatText(title)}</h5>}
        </Link>
        {status !== 'resolved' ? null : (
          <img
            className={classes['likes-img']}
            src={likesImg}
            alt="likes"
            onClick={() => {
              switch (favorited) {
                case false:
                  user &&
                    dispatch(
                      fetchFavoriteArticle({
                        slug: slug,
                        token: user.token,
                        method: 'POST',
                      })
                    );
                  break;
                default:
                  dispatch(
                    fetchFavoriteArticle({
                      slug: slug,
                      token: user.token,
                      method: 'DELETE',
                    })
                  );
              }
            }}
          />
        )}

        <p className={classes['likes-number']}>
          {status !== 'resolved' ? null : favoritesCount}
        </p>
      </div>

      <div className={classes['article-tags']}>
        {status !== 'resolved'
          ? null
          : tagList &&
            tagList.map((tag) => {
              const id = nanoid();
              const formatTag = tag.replaceAll(' ', '');
              if (formatTag.length > 0) {
                return (
                  <button key={id} className={classes['tag-btn']}>
                    {formatText(tag)}
                  </button>
                );
              }
              return false;
            })}
      </div>
      <p className={classes['article-text']}>
        {status !== 'resolved' ? spinner : formatText(description)}
      </p>
      <div className={classes['article-acc']}>
        <div className={classes['acticle-acc__text']}>
          <p className={classes['acticle-acc__name']}>
            {status !== 'resolved' ? null : author.username}
          </p>
          <p className={classes['acticle-acc__date']}>
            {status !== 'resolved' ? null : formatDate}
          </p>
        </div>
        {status !== 'resolved' ? (
          spinner
        ) : (
          <img
            className={classes['acticle-acc__logo']}
            src={
              author.image !==
              'https://static.productionready.io/images/smiley-cyrus.jpg'
                ? author.image
                : noImage
            }
            alt="logo"
            onError={(err) => {
              err.target.src = noImage;
            }}
          />
        )}
      </div>
    </div>
  );
}
