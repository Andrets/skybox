import { SkeletonProps } from "@mui/material";
import { FC } from "react";
import { Skeleton } from "@mui/material";

const LoaderSkeletonImage: FC<SkeletonProps> = ({ className, style }) => {
  return (
    <Skeleton
      className={className}
      style={style}
      sx={{ width: "100%", height: "100%", borderRadius: "10px" }}
    />
  );
};

export default LoaderSkeletonImage;
