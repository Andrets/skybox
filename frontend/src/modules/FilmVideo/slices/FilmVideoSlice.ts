import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  isOpenListEpisodes: false,
  isPlayVideo: false,
  isViewControlVideo: true,
  videoLength: 0,
  videoCurTime: 0,
};

const filmVideoSlice = createSlice({
  name: "filmVideoSlice",
  initialState,
  reducers: {
    toggleListEpisodes: (state, action: PayloadAction<boolean>) => {
      state.isOpenListEpisodes = action.payload;
    },
    togglePlayVideo: (state, action: PayloadAction<boolean>) => {
      state.isPlayVideo = action.payload;
    },
    toggleViewControlVideo: (state, action: PayloadAction<boolean>) => {
      state.isViewControlVideo = action.payload;
    },
    setVideoLength: (state, action: PayloadAction<number>) => {
      state.videoLength = action.payload;
    },
    setVideoCurTime: (state, action: PayloadAction<number>) => {
      state.videoCurTime = action.payload;
    },
  },
});

export const {
  toggleListEpisodes,
  togglePlayVideo,
  toggleViewControlVideo,
  setVideoLength,
  setVideoCurTime,
} = filmVideoSlice.actions;

export default filmVideoSlice.reducer;
