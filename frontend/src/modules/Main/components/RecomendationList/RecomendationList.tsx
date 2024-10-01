import styles from "./styles.module.scss";
import posterIMG from "@images/image.jpg";
import { RecomendationCard } from "../../ui";
import { LazyLoadComponent } from "react-lazy-load-image-component";

export const RecomendationList = () => {
  return (
    <div className={`container ${styles.container}`}>
      <LazyLoadComponent threshold={-20}>
        <RecomendationCard
          to={"/filmInfo"}
          poster={posterIMG}
          name="My Son, The Richest Tycoon"
        />
      </LazyLoadComponent>

      <LazyLoadComponent threshold={-20}>
        <RecomendationCard
          to={"/filmInfo"}
          poster={posterIMG}
          name="My Son, The Richest Tycoon"
        />
      </LazyLoadComponent>

      <LazyLoadComponent threshold={-20}>
        <RecomendationCard
          to={"/filmInfo"}
          poster={posterIMG}
          name="My Son, The Richest Tycoon"
        />
      </LazyLoadComponent>

      <LazyLoadComponent threshold={-20}>
        <RecomendationCard
          to={"/filmInfo"}
          poster={posterIMG}
          name="My Son, The Richest Tycoon"
        />
      </LazyLoadComponent>
      <LazyLoadComponent threshold={-20}>
        <RecomendationCard
          to={"/filmInfo"}
          poster={posterIMG}
          name="My Son, The Richest Tycoon"
        />
      </LazyLoadComponent>

      <LazyLoadComponent threshold={-20}>
        <RecomendationCard
          to={"/filmInfo"}
          poster={posterIMG}
          name="My Son, The Richest Tycoon"
        />
      </LazyLoadComponent>

      <LazyLoadComponent threshold={-20}>
        <RecomendationCard
          to={"/filmInfo"}
          poster={posterIMG}
          name="My Son, The Richest Tycoon"
        />
      </LazyLoadComponent>
    </div>
  );
};
