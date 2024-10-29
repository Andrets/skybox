import { isNotFoundShortsDetail } from "@/shared/helpers/checkTypeFunctions";
import {
  NotFoundShortsDetail,
  ShortsItemModel,
} from "@/shared/models/ShortsApi";
import { NotFoundSlide, ShortsItem } from "./components";

export const ShortsSlide = ({
  data,
  isActive,
  isLoadVideo,
  autoPlay,
}: {
  data: ShortsItemModel | NotFoundShortsDetail;
  isActive: boolean;
  isLoadVideo: boolean;
  autoPlay?: boolean;
}) => {
  if (isNotFoundShortsDetail(data)) return <NotFoundSlide />;

  return (
    <ShortsItem
      autoPlay={autoPlay}
      isLoadVideo={isLoadVideo}
      shorts_id={data.id}
      video={data.video}
      likes={data.likes}
      episode={data.episode}
      serail_name={data.serail_name}
      name={data.name}
      isActive={isActive}
      serial_id={data.serail_id}
      is_liked={data.is_liked}
    />
  );
};
