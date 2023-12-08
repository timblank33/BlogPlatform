import React, { useEffect } from 'react';
import classes from './editArticle.module.scss';

import CreateTags from './CreateTags';

import { clearSuccess, fetchEditArticle } from '../../store/articleSlice';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { nanoid } from 'nanoid';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

export default function EditArticle(object) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { user } = useSelector((state) => state.login);
  const { opened, success } = useSelector((state) => state.list);
  const { title, description, body, tagList } = object?.article;

  const [tagsErr, setTagsErr] = useState(false);
  const [tagsArr, setTagsArr] = useState(tagList);
  const [tagName, setTagName] = useState('');

  const tagsFilter = (tag) => {
    setTagsArr(tagsArr.filter((el) => el !== tag));
  };
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    dispatch(clearSuccess());
  }, [dispatch]);
  return (
    <form
      className={classes['create-article']}
      onSubmit={handleSubmit((data) => {
        dispatch(
          fetchEditArticle({
            data,
            token: user.token,
            article: opened.article,
            tagsArr,
          })
        );
        setTimeout(() => {
          navigate(`/${id}`);
        }, 1000);
      })}
    >
      <p className={classes['title-create-article']}>Edit Article</p>
      <div className={classes['inputs-block']}>
        <label className={classes['label-create-article']} htmlFor="title">
          Title
        </label>
        <input
          {...register('title', {
            required: 'This is required',
            pattern: {
              value:
                /^(?!.*(\s)\1{1,})(?!.*(\S)\2{3,})(?=.*[a-zа-яA-ZА-Я\d])[a-zа-яA-ZА-Я\d](\s*[a-zа-яA-ZА-Я\d])+$/,
              message:
                'Not validate title. Remove extra spaces in the line or more than 4 identical symbols',
            },
          })}
          className={classes['input-create-article']}
          type="text"
          name="title"
          id="title"
          placeholder="Title"
          defaultValue={title}
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
            pattern: {
              value:
                /^(?!.*(\s)\1{1,})(?!.*(\S)\2{3,})(?=.*[a-zа-яA-ZА-Я\d])[a-zа-яA-ZА-Я\d](\s*[a-zа-яA-ZА-Я\d])+$/,
              message:
                'Not validate title. Remove extra spaces in the line or more than 4 identical symbols',
            },
          })}
          className={classes['input-create-article']}
          type="text"
          name="shortsDescription"
          id="shortsDescription"
          placeholder="Title"
          defaultValue={description}
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
            pattern: {
              value:
                /^(?!.*(\s)\1{1,})(?!.*(\S)\2{3,})(?=.*[a-zа-яA-ZА-Я\d])[a-zа-яA-ZА-Я\d](\s*[a-zа-яA-ZА-Я\d])+$/,
              message:
                'Not validate text. Remove extra spaces in the line or more than 4 identical symbols',
            },
          })}
          className={`${classes['input-create-article']} ${classes['input-textarea']}`}
          placeholder="Text"
          defaultValue={body}
        />
        <p className={classes['error-message']}>{errors.text?.message}</p>
      </div>
      <div>
        <label className={classes['label-create-article']} htmlFor="title">
          Tags
        </label>
        {tagsArr &&
          tagsArr.map((item) => {
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
          {!tagsErr ? null : (
            <p className={classes['error-message']}>
              Not validate tag. Remove extra spaces in the line or one or more
              than 4 identical symbols
            </p>
          )}
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
              if (
                tagName.match(
                  /^(?!.*(\s)\1{1,})(?!.*(\S)\2{3,})(?=.*[a-zа-яA-ZА-Я]\d)[a-zа-яA-ZА-Я\d](\s*[a-zа-яA-ZА-Я\d])+$/
                )
              ) {
                setTagsErr(false);
                setTagsArr((oldArr) => [...oldArr, tagName]);
                setTagName('');
              } else {
                setTagsErr(true);
              }
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
          <p className={classes['error-message']}>
            {success?.errors.error.name}
          </p>
        )}
      </div>
    </form>
  );
}
