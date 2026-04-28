import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  playlists: [],
};

export const playlistSlice = createSlice({
  name: "playlist",
  initialState,
  reducers: {
    addToPlaylists: (state, action) => {
      const exists = state.playlists.some((p) => p.id === action.payload.id);

      if (!exists) {
        state.playlists.push({
          id: action.payload.id,
          name: action.payload.name,
        });
      }
    },
    setPlaylists: (state, action) => {
      state.playlists = action.payload;
    },
    removeFromPlaylists: (state, action) => {
      state.playlists = state.playlists.filter((playlist) => {
        return playlist.id !== action.payload;
      });
    },
  },
});

export const { addToPlaylists, removeFromPlaylists, setPlaylists } =
  playlistSlice.actions;

export default playlistSlice.reducer;
