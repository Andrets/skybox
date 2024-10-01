import { createBrowserRouter, RouteObject } from "react-router-dom";
import MainPage from "@/pages/MainPage/MainPage";
import FilmInfoPage from "@/pages/FilmInfoPage/FilmInfoPage";
import FilmVideoPage from "@/pages/FimVideoPage/FilmVideoPage";
import { SettingsPage } from "@/pages/SettingsPage/SettingsPage";
import { SelectLanguagePage } from "@/pages/SelectLanguagePage/SelectLanguagePage";
import { DefaultLayout, SettingsLayout } from "@/layouts";
import PrivacyPolicyPage from "@/pages/PrivacyPolicyPage/PrivacyPolicyPage";
import { ProfilePage } from "@/pages/ProfilePage/ProfilePage";
import { LikesPage } from "@/pages/LikesPage/LikesPage";
import { StartPageLayout } from "@/layouts/StartPageLayout/StartPageLayout";
import { SearchPage } from "@/pages/SearchPage/SearchPage";
import { ShortsPage } from "@/pages/ShortsPage/ShortsPage";
import { DMCAPAge } from "@/pages/DMCAPage/DMCAPage";
import { TermsOfUsePage } from "@/pages/TermsOfUsePage/TermsOfUsePage";
import { AddCartPage } from "@/pages/AddCardPage/AddCardPage";
import { SelectPaymentPage } from "@/pages/SelectPaymentPage/SelectPaymentPage";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <DefaultLayout />,
    children: [
      {
        path: "",
        element: <StartPageLayout />,
        children: [
          { path: "", element: <MainPage /> },
          { path: "/search", element: <SearchPage /> },
        ],
      },
      { path: "profile", element: <ProfilePage /> },
      { path: "likes", element: <LikesPage /> },
      { path: "shorts", element: <ShortsPage /> },
    ],
  },

  { path: "/filmInfo", element: <FilmInfoPage /> },
  { path: "/filmVideo", element: <FilmVideoPage /> },

  {
    path: "/",
    element: <SettingsLayout />,
    children: [
      { path: "settings", element: <SettingsPage /> },
      { path: "lang", element: <SelectLanguagePage /> },
      { path: "privacyPolicy", element: <PrivacyPolicyPage /> },
      { path: "dmca", element: <DMCAPAge /> },
      { path: "payment", element: <SelectPaymentPage /> },
      { path: "termsofuse", element: <TermsOfUsePage /> },
      { path: "addCard", element: <AddCartPage /> },
    ],
  },
];

export const router = createBrowserRouter(routes);
