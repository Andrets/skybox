export declare const window: Window &
  typeof globalThis & {
    Telegram: unknown;
  };

interface CustomSliderEventDetail {
  value: number | number[];
}

declare global {
  interface WindowEventMap {
    sliderUserChangeEvent: CustomEvent<CustomSliderEventDetail>;
  }
}
