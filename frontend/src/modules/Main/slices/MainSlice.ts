import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MainSliceState } from "../models/models";
import { ExclusiveOriginalsSearchParams } from "@/shared/models/MainPageApi";

const initialState: MainSliceState = {
  activeCategory: ExclusiveOriginalsSearchParams.popular,
};

export const mainSlice = createSlice({
  name: "MainSlice",
  initialState,
  reducers: {
    setActiveCategory: (
      state,
      action: PayloadAction<ExclusiveOriginalsSearchParams>
    ) => {
      state.activeCategory = action.payload;
    },
  },
});

export default mainSlice.reducer;

export const { setActiveCategory } = mainSlice.actions;
