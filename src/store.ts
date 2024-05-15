import {
  configureStore,
  createListenerMiddleware,
  TypedStartListening,
} from "@reduxjs/toolkit";
import menuReducer from "./features/menu/menuSlice.ts";
import gameReducer from "./features/game/gameSlice.ts";
import alertsReducer from "./features/alerts/alertsSlice.ts";

const localStorageMiddleware = createListenerMiddleware();

export type AppStartListening = TypedStartListening<RootState, AppDispatch>;

export const startAppListening =
  localStorageMiddleware.startListening as AppStartListening;

startAppListening({
  predicate: (_, currentState, previousState) => {
    return currentState.game !== previousState.game;
  },
  effect: (action, listenerApi) => {
    if (action.type.startsWith("game")) {
      const state = listenerApi.getState();
      localStorage.setItem("game", JSON.stringify(state.game));
    }
  },
});

export const store = configureStore({
  reducer: {
    menu: menuReducer,
    game: gameReducer,
    alerts: alertsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localStorageMiddleware.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
