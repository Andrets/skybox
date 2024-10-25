import FilmVideo from "@/modules/Serial/Serial";
import { SerialContextProvider } from "@/reusable-in-pages/contexts/SerialContext/provider";

const FilmSeriesPage = () => {
  return (
    <SerialContextProvider>
      <FilmVideo />
    </SerialContextProvider>
  );
};

export default FilmSeriesPage;
