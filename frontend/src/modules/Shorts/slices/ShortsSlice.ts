import { ShortsItemModel } from "@/shared/models/ShortsApi";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ShortsSliceState {
  activeShortsItemInfo: ShortsItemModel | null;
}

const initialState: ShortsSliceState = {
  activeShortsItemInfo: null,
};

export const shortsSlice = createSlice({
  initialState,
  name: "shorts",
  reducers: {
    setActiveShortsInfo: (
      state,
      action: PayloadAction<ShortsItemModel | null>
    ) => {
      state.activeShortsItemInfo = action.payload;
    },
  },
});

export default shortsSlice.reducer;

export const { setActiveShortsInfo } = shortsSlice.actions;
