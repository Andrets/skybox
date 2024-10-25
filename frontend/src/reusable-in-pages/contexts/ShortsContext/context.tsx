import { createContext } from "react";

export interface ShortsItemContextModel {
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  videoLength: number;
  setVideoLength: React.Dispatch<React.SetStateAction<number>>;
  curTime: number;
  setCurTime: React.Dispatch<React.SetStateAction<number>>;
  viewPlay: boolean;
  setViewPlay: React.Dispatch<React.SetStateAction<boolean>>;
  videoRef: React.RefObject<HTMLVideoElement>;
  isChangingTime: boolean;
  setIsChangingTime: React.Dispatch<React.SetStateAction<boolean>>;
  userIsView: boolean;
  setUserIsView: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ShortsItemContext = createContext<ShortsItemContextModel>(null!);
