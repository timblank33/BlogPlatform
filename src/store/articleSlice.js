import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchList = createAsyncThunk(
  'articleList/fetchProps',
  async function fetchUrl(object) {
    const response = await fetch(
      `https://blog.kata.academy/api/articles?limit=5&offset=${object.number}`,
      {
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json;charset=utf-8',
          Authorization: `Bearer ${object.token}`,
        },
      }
    );
    if (response.status !== 200) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await fetchUrl(object.number);
    }
    const body = await response.json();

    return body;
  }
);

export const fetchNewArticle = createAsyncThunk(
  'articleList/success',
  async (object) => {
    const response = await fetch(`https://blog.kata.academy/api/articles`, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: `Bearer ${object.token}`,
      },
      body: JSON.stringify({
        article: {
          title: object.data.title,
          description: object.data.shortsDescription,
          body: object.data.text,
          tagList: object.tagsArr,
        },
      }),
    });

    const body = await response.json();
    return body;
  }
);

export const fetchDeleteArticle = createAsyncThunk(
  'articleList/success',
  async (object) => {
    const response = await fetch(
      `https://blog.kata.academy/api/articles/${object.slug}`,
      {
        method: 'DELETE',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json;charset=utf-8',
          Authorization: `Bearer ${object.token}`,
        },
      }
    );

    const body = await response.json();
    return body;
  }
);

export const fetchEditArticle = createAsyncThunk(
  'articleList/success',
  async function (object) {
    const response = await fetch(
      `https://blog.kata.academy/api/articles/${object.article.slug}`,
      {
        method: 'PUT',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json;charset=utf-8',
          Authorization: `Bearer ${object.token}`,
        },
        body: JSON.stringify({
          article: {
            title: object.data.title,
            description: object.data.shortsDescription,
            body: object.data.text,
            tagList: object.tagsArr,
          },
        }),
      }
    );

    const body = await response.json();
    return body;
  }
);

export const fetchArticle = createAsyncThunk(
  'articleList/opened',
  async function fetchArt(object) {
    const response = await fetch(
      `https://blog.kata.academy/api/articles/${object.id}`,
      {
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json;charset=utf-8',
          Authorization: `Bearer ${object.token}`,
        },
      }
    );
    if (response.status !== 200) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await fetchArt(object.slug);
    }

    const body = await response.json();
    return body;
  }
);

export const fetchFavoriteArticle = createAsyncThunk(
  'articleList/favorite',
  async function (object) {
    const response = await fetch(
      `https://blog.kata.academy/api/articles/${object.slug}/favorite`,
      {
        method: object.method,
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json;charset=utf-8',
          Authorization: `Bearer ${object.token}`,
        },
      }
    );

    const body = await response.json();
    return body;
  }
);

const articleSlice = createSlice({
  name: 'articleList',
  initialState: {
    fetchProps: { articles: [1, 2, 3, 4, 5] },
    opened: null,
    modalDelete: false,
    status: null,
    error: null,
    success: null,
    pageNumber: 1,
  },
  reducers: {
    currentPage(state, action) {
      state.pageNumber = action.payload;
      localStorage.setItem('pageNumber', action.payload);
      fetchList((+localStorage.getItem('pageNumber') - 1) * 5);
    },
    clearSuccess(state, action) {
      state.success = null;
    },
    clearOpened(state, action) {
      state.opened = null;
      state.modalDelete = false;
    },
    openArticle(state, action) {
      state.opened = action.payload;
    },
    openModal(state, action) {
      state.modalDelete = action.payload;
    },
  },
  extraReducers: {
    [fetchList.pending]: (state, action) => {
      state.status = 'loading';
      state.error = null;
    },
    [fetchList.fulfilled]: (state, action) => {
      state.fetchProps = action.payload;
      state.status = 'resolved';
    },
    [fetchList.rejected]: (state, action) => {
      state.status = 'rejected';
      state.error = action.payload;
    },

    [fetchArticle.pending]: (state, action) => {
      state.status = 'loading';
      state.error = null;
    },

    [fetchArticle.fulfilled]: (state, action) => {
      state.opened = action.payload;
      state.status = 'resolved';
    },
    [fetchEditArticle.fulfilled]: (state, action) => {
      state.success = action.payload;
    },
    [fetchDeleteArticle.fulfilled]: (state, action) => {
      state.success = action.payload;
    },
    [fetchNewArticle.fulfilled]: (state, action) => {
      state.success = action.payload;
    },
    [fetchFavoriteArticle.fulfilled]: (state, { payload }) => {
      if (state.fetchProps.articles && !state.opened) {
        state.fetchProps.articles = state.fetchProps.articles.map((article) => {
          if (
            article.slug === payload.article.slug &&
            payload.article.favorited
          ) {
            article.favoritesCount += 1;
            article.favorited = true;
          } else if (
            article.slug === payload.article.slug &&
            !payload.article.favorited
          ) {
            article.favoritesCount -= 1;
            article.favorited = false;
          }
          return article;
        });
      } else if (state.opened.article) {
        if (payload.article.favorited) {
          state.opened.article.favoritesCount += 1;
          state.opened.article.favorited = true;
        } else if (!payload.article.favorited) {
          state.opened.article.favoritesCount -= 1;
          state.opened.article.favorited = false;
        }
      }
    },
  },
});

export const {
  clearSuccess,
  currentPage,
  openArticle,
  clearOpened,
  openModal,
} = articleSlice.actions;

export default articleSlice.reducer;
