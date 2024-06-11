import { createSlice, createEntityAdapter } from '@reduxjs/toolkit'

const channelsAdapter = createEntityAdapter();

// По умолчанию: { ids: [], entities: {} }
const initialState = channelsAdapter.getInitialState();

const slice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    addChannels: channelsAdapter.addMany,
    delChannel: (state, { payload }) => {
      state.channels = state.channels.filter((channel) => channel.id !== payload);
      console.log(payload)
    }
  },
})

export const { setChannels, delChannel } = slice.actions
// export const channelsSelectors = channelsAdapter.getSelectors((state) => state.channels);
export default slice.reducer
