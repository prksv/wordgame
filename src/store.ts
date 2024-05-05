import { configureStore } from "@reduxjs/toolkit";
import menuReducer from "./features/menu/menuSlice.ts";
import gameReducer from "./features/game/gameSlice.ts";
import alertsReducer from "./features/alerts/alertsSlice.ts";


export const store = configureStore({
  reducer: {
    menu: menuReducer,
    game: gameReducer,
    alerts: alertsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
