import { SeriesItem } from "@/shared/models/FilmInfoApi";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface InitialStateModel {
  isOpenListEpisodes: boolean;
  isPlayVideo: boolean;
  isViewControlVideo: boolean;
  videoLength: number;
  videoCurTime: number;
  activeEpisode: number;
  paginationPage: number;
  isBlockedSlide: boolean;
  isOpenRating: boolean;
  isCommentsModalOpen: boolean;
  isCurrentSeriesInfoData: null | SeriesItem;
}

const initialState: InitialStateModel = {
  isOpenListEpisodes: false,
  isPlayVideo: false,
  isViewControlVideo: true,
  videoLength: 0,
  videoCurTime: 0,
  activeEpisode: 0,
  paginationPage: 0,
  isBlockedSlide: false,
  isOpenRating: false,
  isCommentsModalOpen: false,
  isCurrentSeriesInfoData: null,
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
    setActiveEpisode: (state, action: PayloadAction<number>) => {
      state.activeEpisode = action.payload;
    },
    setPaginationPage: (state, action: PayloadAction<number>) => {
      state.paginationPage = action.payload;
    },
    setIsBlockedSlide: (state, action: PayloadAction<boolean>) => {
      state.isBlockedSlide = action.payload;
    },
    setOpenRating: (state, action: PayloadAction<boolean>) => {
      state.isOpenRating = action.payload;
    },
    setIsCommentsModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isCommentsModalOpen = action.payload;
    },
    setIsCurrentSeriesInfoData: (
      state,
      action: PayloadAction<null | SeriesItem>
    ) => {
      state.isCurrentSeriesInfoData = action.payload;
    },
    resetState: () => {
      return { ...initialState };
    },
  },
});

export const {
  toggleListEpisodes,
  togglePlayVideo,
  toggleViewControlVideo,
  setVideoLength,
  setVideoCurTime,
  setActiveEpisode,
  setPaginationPage,
  setIsBlockedSlide,
  setIsCommentsModalOpen,
  resetState,
  setOpenRating,
  setIsCurrentSeriesInfoData,
} = filmVideoSlice.actions;

export default filmVideoSlice.reducer;
