import { createSlice, createEntityAdapter } from '@reduxjs/toolkit'

const initialState = {
  channels: [],
}

const slice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    setChannels: (state, { payload }) => {
      state.channels = payload;
    },
    delChannel: (state, { payload }) => {
      state.channels = state.channels.filter((channel) => channel.id !== payload);
    }
  },
})

export const { setChannels, delChannel } = slice.actions;

export default slice.reducer
