import React, { HTMLAttributes } from "react";

export interface FilmNameProps extends HTMLAttributes<HTMLHeadElement> {
  name: string | React.ReactNode;
  episode: string | number;
}
