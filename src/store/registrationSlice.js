import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchRegistration = createAsyncThunk(
  'registration',
  async function (object) {
    const response = await fetch(`https://blog.kata.academy/api/users`, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({
        user: object,
      }),
    });
    if (response.status !== 200 && response.status !== 422) {
      throw new Error('Refresh page');
    }

    const body = await response.json();

    return body;
  }
);

const registrationSlice = createSlice({
  name: 'registration',
  initialState: {
    errors: null,
  },
  reducers: {
    clearStatusUp(state, action) {
      state.status = null;
    },
  },
  extraReducers: {
    [fetchRegistration.pending]: (state, action) => {
      state.status = 'loading';
      state.errors = null;
    },
    [fetchRegistration.fulfilled]: (state, { payload }) => {
      state.status = 'resolved';
      payload.errors ? (state.errors = payload.errors) : (state.errors = null);
    },
    [fetchRegistration.rejected]: (state, action) => {
      state.status = 'rejected';
      state.errors = action.payload;
    },
  },
});

export const { clearStatusUp } = registrationSlice.actions;
export default registrationSlice.reducer;
