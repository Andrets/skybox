import { apiSlice } from "@/app/store/api";
import { DocumentAPIInfo } from "@/shared/models/DocumentsApi";

export const documentsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDMCA: builder.query<DocumentAPIInfo, void>({
      query: () => {
        return {
          url: "documents/get_docs?type=DMCA",
          method: "GET",
        };
      },
      providesTags: ["Language"],
    }),

    getTerms: builder.query<DocumentAPIInfo, void>({
      query: () => {
        return {
          url: "documents/get_docs?type=TERMS_OF_USE",
          method: "GET",
        };
      },
      providesTags: ["Language"],
    }),
    getPolicy: builder.query<DocumentAPIInfo, void>({
      query: () => {
        return {
          url: "documents/get_docs?type=PRIVACY_POLICY",
          method: "GET",
        };
      },
      providesTags: ["Language"],
    }),
  }),
});

export const { useGetTermsQuery, useGetDMCAQuery, useGetPolicyQuery } =
  documentsApiSlice;
