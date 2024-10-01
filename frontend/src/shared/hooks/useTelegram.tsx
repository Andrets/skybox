import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export interface ITelegramContext {
  webApp: WebApp;
}

const TelegramContext = createContext<ITelegramContext | undefined>(undefined);

export const TelegramProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [webApp, setWebApp] = useState<WebApp | undefined>(undefined);

  useEffect(() => {
    const app = window.Telegram?.WebApp;
    if (app) {
      app.ready();
      app.expand();
      app.disableVerticalSwipes();
      setWebApp(app);
    }
  }, []);

  const value = useMemo(() => {
    if (webApp) {
      return {
        webApp,
      };
    }
    return undefined;
  }, [webApp]);

  if (!value) {
    return null; // Возвращаем null, пока webApp и user не будут установлены
  }

  return (
    <TelegramContext.Provider value={value}>
      {children}
    </TelegramContext.Provider>
  );
};

export const useTelegram = () => {
  const context = useContext(TelegramContext);
  if (context === undefined) {
    throw new Error("useTelegram must be used within a TelegramProvider");
  }
  return context;
};
