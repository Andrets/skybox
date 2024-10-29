import { YooMoneyCheckoutErrorList } from "./shared/constants/constants";

export declare const window: Window &
  typeof globalThis & {
    Telegram: unknown;
  };

typeof globalThis &
  {
    YooMoneyCheckout: unknown,
  };

interface CustomSliderEventDetail {
  value: number | number[];
}

declare global {
  interface WindowEventMap {
    sliderUserChangeEvent: CustomEvent<CustomSliderEventDetail>;
  }
}

interface PaymentTokenizeResponse {
  message: string;
  paymentToken: string;
  status_code: number;
  type: string;
}

interface TokenizeValidationErrorParams {
  code: YooMoneyCheckoutErrorList;
  message: string;
}

interface TokenizeValidationError {
  code: string | undefine;
  message: string | undefined;
  params: TokenizeValidationErrorParams[];
  status_code: number;
  type: string;
}

interface PaymentTokenize {
  status: string;
  data?: PaymentTokenizeResponse;
  error?: TokenizeValidationError;
}

declare global {
  interface Window {
    YooMoneyCheckout: (
      str: string,
      config?: { language: "ru" | "en" }
    ) => {
      tokenize: ({
        number: string,
        cvc: string,
        month: string,
        year: string,
      }) => Promise<PaymentTokenize>;
    };
  }
}
