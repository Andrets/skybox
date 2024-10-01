import useBackButton from "@/shared/hooks/useBackButton";
import FilmAssets from "./components/FilmAssets/FilmAssets";
import Info from "./components/Info/Info";
import useBlockScroll from "@/shared/hooks/useBlockScroll";

const FilmInfo = () => {
  useBlockScroll(true);
  useBackButton();
  return (
    <>
      <div style={{ padding: 0 }} className="container">
        <FilmAssets />
      </div>
      <Info />
    </>
  );
};

export default FilmInfo;
