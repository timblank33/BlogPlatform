import React, { useEffect } from 'react';
import classes from './articlesDetails.module.scss';
import noImage from '../../assets/no-image.gif';
import likesImg from '../../assets/likes.svg';
import Markdown from 'react-markdown';
import format from 'date-fns/format';
import frameImg from '../../assets/frame.svg';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { nanoid } from 'nanoid';
import { useDispatch, useSelector } from 'react-redux';
import { FallingLines } from 'react-loader-spinner';
import {
  fetchArticle,
  fetchDeleteArticle,
  fetchFavoriteArticle,
  openModal,
} from '../../store/articleSlice';

export const ArticleDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.login);

  useEffect(() => {
    dispatch(fetchArticle({ id, token: user?.token }));
  }, [dispatch, id, user]);

  const open = useSelector((state) => state.list.opened);

  const { status, modalDelete } = useSelector((state) => state.list);

  const navigate = useNavigate();
  const spinner = (
    <FallingLines
      color="#4fa94d"
      width="40"
      height="20"
      visible={true}
      ariaLabel="falling-lines-loading"
    />
  );
  const formatDate = format(
    new Date(open?.article.createdAt || 0),
    'MMMM d, yyyy'
  );
  const editBtn = (
    <React.Fragment>
      <div className={classes['btn-block']}>
        <button
          className={classes['delete-btn']}
          onClick={(e) => {
            dispatch(openModal(true));
          }}
        >
          Delete
        </button>
        <div
          className={`${classes['delete-modal']} ${
            modalDelete ? classes['modal-active'] : ''
          }`}
        >
          <div className={classes['fon-modal']}>
            <div className={classes['text-block']}>
              <img src={frameImg} alt="info"></img>
              <p className={classes['text-modal']}>
                Are you sure to delete this article?
              </p>
            </div>

            <div className={classes['block-modal-btn']}>
              <button
                className={classes['btn']}
                onClick={(e) => {
                  dispatch(openModal(false));
                }}
              >
                No
              </button>
              <button
                className={classes['btn']}
                onClick={() => {
                  dispatch(
                    fetchDeleteArticle({
                      token: user.token,
                      slug: open.article.slug,
                    })
                  );
                  navigate('/');
                }}
              >
                Yes
              </button>
            </div>
          </div>
          <div className={classes['romb-modal']}></div>
        </div>
        <Link to={`/${id}/edit`}>
          <button className={classes['edit-btn']}>Edit</button>
        </Link>
      </div>
    </React.Fragment>
  );
  return (
    <div className={classes['article-details']}>
      <div className={classes['article-title']}>
        {status !== 'resolved' ? null : (
          <React.Fragment>
            <h5>{open?.article.title}</h5>
            <img
              className={classes['likes-img']}
              src={likesImg}
              alt="likes"
              onClick={() => {
                switch (open.article.favorited) {
                  case false:
                    user &&
                      dispatch(
                        fetchFavoriteArticle({
                          slug: open.article.slug,
                          token: user.token,
                          method: 'POST',
                        })
                      );
                    break;
                  default:
                    dispatch(
                      fetchFavoriteArticle({
                        slug: open.article.slug,
                        token: user.token,
                        method: 'DELETE',
                      })
                    );
                }
              }}
            />
            <p className={classes['likes-number']}>
              {open?.article.favoritesCount}
            </p>
          </React.Fragment>
        )}
      </div>
      {status !== 'resolved' ? (
        spinner
      ) : (
        <React.Fragment>
          <div className={classes['article-tags']}>
            {open?.article.tagList.map((tag) => {
              const id = nanoid();
              if (tag.length > 0) {
                return (
                  <button key={id} className={classes['tag-btn']}>
                    {tag}
                  </button>
                );
              }
              return false;
            })}
          </div>
          <p className={classes['article-text']}>{open?.article.description}</p>
          <span className={classes['article-body']}>
            <Markdown>{open?.article.body}</Markdown>
          </span>
        </React.Fragment>
      )}

      <div className={classes['article-acc']}>
        <div className={classes['acticle-acc__text']}>
          {status !== 'resolved' ? null : (
            <React.Fragment>
              <p className={classes['acticle-acc__name']}>
                {open?.article.author.username}
              </p>
              <p className={classes['acticle-acc__date']}>{formatDate}</p>
            </React.Fragment>
          )}
        </div>
        {status !== 'resolved' ? (
          spinner
        ) : (
          <img
            className={classes['acticle-acc__logo']}
            src={open?.article.author.image}
            alt="logo"
            width={`46px`}
            onError={(err) => {
              err.target.src = noImage;
            }}
          />
        )}
      </div>
      {open?.article.author.username === user?.username && status === 'resolved'
        ? editBtn
        : null}
    </div>
  );
};
