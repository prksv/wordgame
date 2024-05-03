import { configureStore, Middleware } from "@reduxjs/toolkit";
import menuReducer from "./features/menu/menuSlice.ts";
import gameReducer from "./features/game/gameSlice.ts";
import alertsReducer from "./features/alerts/alertsSlice.ts";

export const wordSubmitMiddleware: Middleware =
  () => (next) => async (action) => {
    console.log(action);
    return next(action);
  };

export const store = configureStore({
  reducer: {
    menu: menuReducer,
    game: gameReducer,
    alerts: alertsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(wordSubmitMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
