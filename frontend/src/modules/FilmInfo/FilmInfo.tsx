import useBackButton from "@/shared/hooks/useBackButton";
import FilmAssets from "./components/FilmAssets/FilmAssets";
import Info from "./components/Info/Info";
import useBlockScroll from "@/shared/hooks/useBlockScroll";
import { useParams } from "react-router-dom";
import { useGetFilmInfoQuery } from "@/api/FilmInfoApi";
import { LoaderScreen } from "@/reusable-in-pages/components/Loader/LoaderScreen";

const FilmInfo = () => {
  useBlockScroll();
  useBackButton();
  const { id } = useParams();
  const { data, isLoading, isError } = useGetFilmInfoQuery(String(id));

  if (isLoading) return <LoaderScreen />;
  if (isError) return <></>;
  if (data) {
    return (
      <>
        <div style={{ padding: 0 }} className="container">
          <FilmAssets photos={data.horizontal_photos} />
        </div>
        <Info
          comments={data.comments}
          description={data.description}
          is_new={data.is_new}
          genre={data.genre}
          name={data.name}
          rating={data.rating}
          user_rating={data.user_rating}
        />
      </>
    );
  }

  return <></>;
};

export default FilmInfo;
