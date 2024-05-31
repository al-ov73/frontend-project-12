import { createSlice } from '@reduxjs/toolkit'
// import { PayloadAction } from '@reduxjs/toolkit'
// import { User } from '../../app/services/auth'
// import { RootState } from '../../app/store'

const initialState = {
  user: null,
  token: null,
}

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      {payload: { user, token }},
    ) => {
      state.user = user
      state.token = token
    },
  },
})

export const { setCredentials } = slice.actions

export default slice.reducer

export const selectCurrentUser = (state) => state.auth.user
