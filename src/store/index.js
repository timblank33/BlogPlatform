import { configureStore } from '@reduxjs/toolkit';
import articleSlice from './articleSlice';
import fetchRegistration from './registrationSlice';
import fetchLogin from './loginSlice';

export default configureStore({
  reducer: {
    list: articleSlice,
    registration: fetchRegistration,
    login: fetchLogin,
  },
});
