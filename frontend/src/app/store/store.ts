import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api"; // Правильный импорт apiSlice
import FilmVideoReducer from "@/modules/Serial/slices/FilmVideoSlice";
import SearchInputSlice from "@/reusable-in-pages/slices/SearchFormSlice";
import MainSlice from "@/modules/Main/slices/MainSlice";
import PaySubscribeSlice from "@/modules/PaySubscribe/slices/slice";
import ShortsSlice from "@/modules/Shorts/slices/ShortsSlice";
const store = configureStore({
  reducer: {
    filmVideo: FilmVideoReducer,
    searchInput: SearchInputSlice,
    mainSlice: MainSlice,
    paySubscribe: PaySubscribeSlice,
    shorts: ShortsSlice,
    [apiSlice.reducerPath]: apiSlice.reducer, // Обязательно используем apiSlice.reducerPath
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware), // Добавляем middleware через concat
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
