import { encodedToken } from "@/shared/constants/constants";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://skybox.video/api/",
    headers: {
      "Content-Type": "application/json",
      InitData: `${encodedToken}`,
    },
  }),
  tagTypes: ["Language", "Likes"],
  endpoints: () => ({}),
});
