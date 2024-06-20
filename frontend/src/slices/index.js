import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './usersSlice.js';
import channelsReducer from './channelsSlice.js';

export default configureStore({
  reducer: {
    users: usersReducer,
    channels: channelsReducer,
  },
});
