import FilmInfo from "@/modules/FilmInfo/FilmInfo";
import { LoaderScreen } from "@/reusable-in-pages/components/Loader/LoaderScreen";
import { useNavigation } from "react-router-dom";
const FilmInfoPage = () => {
  const navigation = useNavigation();
  if (navigation.state === "loading") {
    return <LoaderScreen />;
  }
  return (
    <>
      <FilmInfo />
    </>
  );
};

export default FilmInfoPage;
