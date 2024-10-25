import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SearchState {
  searchInput: string;
  searchQueryValue: null | string;
}

const initialState: SearchState = {
  searchInput: "",
  searchQueryValue: null,
};

const searchInputSlice = createSlice({
  name: "searchInput",
  initialState,
  reducers: {
    setSearchInput: (state, action: PayloadAction<string>) => {
      state.searchInput = action.payload;
    },
    setSearchQueryValue: (state, action: PayloadAction<string | null>) => {
      state.searchQueryValue = action.payload;
    },
  },
});

export const { setSearchInput, setSearchQueryValue } = searchInputSlice.actions;

export default searchInputSlice.reducer;
