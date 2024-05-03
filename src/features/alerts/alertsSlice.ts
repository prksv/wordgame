import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

type TAlertData = {
  type: "success" | "error";
  message: string;
};
type TAlertState = {
  isOpen: boolean;
};

type TAlert = TAlertData & {
  id: string;
};

const initialState: (TAlert & TAlertState)[] = [];

export const createAlert = createAsyncThunk(
  "alerts/create",
  (payload: TAlertData, { dispatch }) => {
    const id = uuidv4();
    dispatch(openAlert({ ...payload, id }));
    setTimeout(() => dispatch(closeAlert(id)), 2000);
  },
);

export const alertsSlice = createSlice({
  name: "alerts",
  initialState,
  reducers: {
    openAlert: (state, { payload }: PayloadAction<TAlert>) => {
      state.push({ ...payload, isOpen: true });
    },
    closeAlert: (state, { payload }: PayloadAction<string>) => {
      const alert = state.find((alert) => alert.id === payload);
      if (alert) {
        alert.isOpen = false;
      }
    },
  },
});

export const { openAlert, closeAlert } = alertsSlice.actions;

export default alertsSlice.reducer;
