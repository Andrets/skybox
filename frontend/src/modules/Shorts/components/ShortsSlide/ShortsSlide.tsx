import { isNotFoundShortsDetail } from "@/shared/helpers/checkTypeFunctions";
import {
  NotFoundShortsDetail,
  ShortsItemModel,
} from "@/shared/models/ShortsApi";
import { NotFoundSlide, ShortsItem } from "./components";

export const ShortsSlide = ({
  data,
  isActive,
}: {
  data: ShortsItemModel | NotFoundShortsDetail;
  isActive: boolean;
}) => {
  if (isNotFoundShortsDetail(data)) return <NotFoundSlide />;

  return (
    <ShortsItem
      video={data.video}
      likes={data.likes}
      episode={data.episode}
      serail_name={data.serail_name}
      name={data.name}
      isActive={isActive}
      serial_id={data.id}
    />
  );
};
