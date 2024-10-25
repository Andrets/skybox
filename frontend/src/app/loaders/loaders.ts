import { mainPageApiSlice } from "@/api/MainPageApi";
import { ExclusiveOriginalsSearchParams } from "@/shared/models/MainPageApi";
import { filmInfoApiSlice } from "@/api/FilmInfoApi";
import store from "../store/store";
import { userApiSlice } from "@/api/userApi";
import { Params } from "react-router-dom";
import { documentsApiSlice } from "@/api/DocumentsApi";
import i18n from "../locales/i18n";
export const userLoader = async () => {
  const response = await store.dispatch(
    userApiSlice.endpoints.authorization.initiate()
  );

  if (!response.error) {
    if (response.data) i18n.changeLanguage(response.data.lang);
  }

  return null;
};

export const mainPageLoader = async () => {
  store.dispatch(
    mainPageApiSlice.endpoints.getExclusive.initiate(
      ExclusiveOriginalsSearchParams.popular
    )
  );

  store.dispatch(mainPageApiSlice.endpoints.getRecomendations.initiate());

  store.dispatch(mainPageApiSlice.endpoints.getTopSerials.initiate());

  return null;
};

export const filmInfoLoader = async ({
  params,
}: {
  params: Params<string>;
}) => {
  const id = params.id; // id может быть undefined, поэтому проверяем
  if (!id) {
    throw new Response("Film ID not found", { status: 404 });
  }

  store.dispatch(filmInfoApiSlice.endpoints.getFilmInfo.initiate(id));

  return null;
};

export const dmcaLoader = async () => {
  store.dispatch(documentsApiSlice.endpoints.getDMCA.initiate());

  return null;
};

export const termsLoader = async () => {
  store.dispatch(documentsApiSlice.endpoints.getTerms.initiate());

  return null;
};

export const policyLoader = async () => {
  store.dispatch(documentsApiSlice.endpoints.getPolicy.initiate());

  return null;
};
