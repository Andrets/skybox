import { RecomendationListProps } from "@/modules/Main/models/models";
import { RecomendationCard } from "@/modules/Main/ui";
import { LazyLoadComponent } from "react-lazy-load-image-component";

export const List = ({ data }: RecomendationListProps) => {
  return (
    <>
      {data.map((el) => {
        return (
          <LazyLoadComponent key={el.id} threshold={-20}>
            <RecomendationCard
              to={`/filmVideo/${el.id}`}
              poster={String(el.vertical_photo)}
              name={el.name}
            />
          </LazyLoadComponent>
        );
      })}
    </>
  );
};
