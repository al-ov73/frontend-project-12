import { createSlice } from '@reduxjs/toolkit'

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
    },
    renameChannel: (state, { payload }) => {
      state.channels = state.channels.map((channel) => {
        if (channel.id === payload.id) {
          channel.name = payload.name;
        }
        return channel;
      });
    }
  },
})

export const { setChannels, delChannel, renameChannel } = slice.actions;

export default slice.reducer
