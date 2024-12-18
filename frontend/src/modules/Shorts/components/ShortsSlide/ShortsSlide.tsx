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
      series_id={data.id}
      video={data.video}
      isActive={isActive}
    />
  );
};
