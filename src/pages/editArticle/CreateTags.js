import React from 'react';
import classes from './editArticle.module.scss';

export default function CreateTags(object) {
  const { item, tagsFilter } = object;
  return (
    <div className={classes['tags-block']}>
      <input className={classes['input-tag']} type="text" defaultValue={item} />
      <button
        className={classes['delete-tag']}
        onClick={(e) => {
          tagsFilter(item);
        }}
      >
        Delete
      </button>
    </div>
  );
}
