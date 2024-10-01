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
import { store } from "./app/store.ts";


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <TelegramProvider>
        <ThemeProvider theme={theme}>
          <>
        
            <RouterProvider router={router} />
          </>
        </ThemeProvider>
      </TelegramProvider>
    </Provider>
  </StrictMode>
);
