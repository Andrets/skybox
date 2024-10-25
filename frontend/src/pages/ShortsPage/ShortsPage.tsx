import Shorts from "@/modules/Shorts/Shorts";
import { ShortsListProvider } from "@/reusable-in-pages/contexts/ShortsListContext/provider";

export const ShortsPage = () => {
  return (
    <ShortsListProvider>
      <Shorts />
    </ShortsListProvider>
  );
};
