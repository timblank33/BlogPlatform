import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchLoginInfo = createAsyncThunk(
  'loginInfo',
  async function (token) {
    const response = await fetch(`https://blog.kata.academy/api/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const body = response.json();
    return body;
  }
);

export const fetchEditProfile = createAsyncThunk(
  'editProfile',
  async function (object) {
    const { username, email, password, image, token } = object;
    const response = await fetch(`https://blog.kata.academy/api/user`, {
      method: 'PUT',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        user: {
          username: username,
          email: email,
          password: password,
          image: image,
        },
      }),
    });

    const body = await response.json();
    return body;
  }
);

export const fetchLogin = createAsyncThunk('login', async function (object) {
  const response = await fetch(`https://blog.kata.academy/api/users/login`, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify({
      user: object,
    }),
  });
  if (
    response.status !== 200 &&
    response.status !== 422 &&
    response.status !== 401
  ) {
    throw new Error('Refresh page');
  }
  const body = await response.json();
  localStorage.setItem('user', JSON.stringify(body.user));
  return body;
});

const loginSlice = createSlice({
  name: 'login',
  initialState: {
    errors: null,
    user: null,
  },
  reducers: {
    logOutUser(state, action) {
      state.user = null;
      localStorage.removeItem('user');
    },
    localStorageSave(state, action) {
      state.user = JSON.parse(action.payload);
    },
  },
  extraReducers: {
    [fetchLogin.pending]: (state, action) => {
      state.status = 'loading';
      state.errors = null;
      state.user = null;
    },
    [fetchLogin.rejected]: (state, action) => {
      state.status = 'rejected';
      state.errors = action.payload;
    },
    [fetchLogin.fulfilled]: (state, { payload }) => {
      state.status = 'resolved';
      payload.user
        ? (state.user = payload.user)
        : (state.errors = payload.errors);
    },
    [fetchEditProfile.fulfilled]: (state, { payload }) => {
      state.status = 'resolved';
      payload.user
        ? (state.user = payload.user)
        : (state.user.loginError = payload.errors);
    },
  },
});

export const { logOutUser, localStorageSave } = loginSlice.actions;
export default loginSlice.reducer;