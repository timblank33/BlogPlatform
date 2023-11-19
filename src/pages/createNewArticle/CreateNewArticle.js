import React, { useEffect } from 'react';
import classes from './createNewArcticle.module.scss';

import CreateTags from './CreateTags';

import { fetchNewArticle, clearSuccess } from '../../store/articleSlice';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { nanoid } from 'nanoid';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function CreateNewArticle() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.login);
  const { success } = useSelector((state) => state.list);

  const [tagsArr, setTagsArr] = useState([]);
  const [tagName, setTagName] = useState('');

  const tagsFilter = (tag) => {
    setTagsArr(tagsArr.filter((el) => el !== tag));
  };

  useEffect(() => {
    dispatch(clearSuccess());
  }, [dispatch]);

  return (
    <form
      className={classes['create-article']}
      onSubmit={handleSubmit((data) => {
        dispatch(fetchNewArticle({ data, token: user.token, tagsArr }));
        navigate('/');
      })}
    >
      <p className={classes['title-create-article']}>Create new Article</p>
      <div className={classes['inputs-block']}>
        <label className={classes['label-create-article']} htmlFor="title">
          Title
        </label>
        <input
          {...register('title', {
            required: 'This is required',
          })}
          className={classes['input-create-article']}
          type="text"
          name="title"
          id="title"
          placeholder="Title"
        />
        <p className={classes['error-message']}>{errors.title?.message}</p>
      </div>
      <div className={classes['inputs-block']}>
        <label
          className={classes['label-create-article']}
          htmlFor="shortsDescription"
        >
          Short description
        </label>
        <input
          {...register('shortsDescription', {
            required: 'This is required',
          })}
          className={classes['input-create-article']}
          type="text"
          name="shortsDescription"
          id="shortsDescription"
          placeholder="Title"
        />
        <p className={classes['error-message']}>
          {errors.shortsDescription?.message}
        </p>
      </div>
      <div className={classes['inputs-block']}>
        <label className={classes['label-create-article']} htmlFor="title">
          Text
        </label>
        <textarea
          {...register('text', {
            required: 'This is required',
          })}
          className={`${classes['input-create-article']} ${classes['input-textarea']}`}
          placeholder="Text"
        />
        <p className={classes['error-message']}>{errors.text?.message}</p>
      </div>
      <div>
        <label className={classes['label-create-article']} htmlFor="title">
          Tags
        </label>
        {tagsArr.map((item) => {
          const id = nanoid();
          return (
            <CreateTags
              tagsFilter={tagsFilter}
              tagsArr={tagName}
              item={item}
              key={id}
            />
          );
        })}
        <div className={classes['tags-block']}>
          <input
            className={classes['input-tag']}
            type="text"
            placeholder="Tag"
            onChange={(e) => {
              setTagName(e.target.value);
            }}
            value={tagName}
          />
          <button
            type="button"
            className={classes['delete-tag']}
            onClick={() => {
              setTagName('');
            }}
          >
            Delete
          </button>
          <button
            type="button"
            className={classes['add-tag']}
            onClick={(e) => {
              setTagsArr((oldArr) => [...oldArr, tagName]);
              setTagName('');
            }}
          >
            Add tag
          </button>
        </div>
        <div>
          <input
            type="submit"
            value={'Send'}
            className={classes['create-article-submit']}
          />
        </div>
        {success && !success.errors ? (
          <p className={classes['success-message']}>
            Article successfully changed
          </p>
        ) : (
          <p className={classes['error-message']}>{success?.errors.message}</p>
        )}
      </div>
    </form>
  );
}
