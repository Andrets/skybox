import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./app/styles/App.scss";
import "./app/styles/fonts.scss";
import "./app/styles/vars.scss";
import "./app/styles/index.scss";
import { ThemeProvider } from "@mui/material";
import { theme } from "./app/materialUITheme/theme.ts";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router.tsx";
import { TelegramProvider } from "./shared/hooks/useTelegram.tsx";
import { Provider } from "react-redux";
import store from "./app/store/store.ts";
import "./app/locales/i18n.ts";
import { AddCardProvider } from "./reusable-in-pages/contexts/AddCardContext/provider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <TelegramProvider>
        <ThemeProvider theme={theme}>
          <AddCardProvider>
            <RouterProvider router={router} />
          </AddCardProvider>
        </ThemeProvider>
      </TelegramProvider>
    </Provider>
  </StrictMode>
);
