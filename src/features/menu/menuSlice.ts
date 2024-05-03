import { createSlice } from "@reduxjs/toolkit";

export interface MenuState {
  isOpen: boolean;
  isRulesOpen: boolean;
}

const initialState: MenuState = {
  isOpen: true,
  isRulesOpen: false,
};

export const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    toggleMenu: (state) => {
      state.isOpen = !state.isOpen;
    },
    toggleRules: (state) => {
      state.isRulesOpen = !state.isRulesOpen;
    },
    openMenu: (state) => {
      state.isOpen = true;
    },
    openRules: (state) => {
      state.isRulesOpen = true;
    },
    closeMenu: (state) => {
      state.isOpen = false;
    },
    closeRules: (state) => {
      state.isRulesOpen = false;
    },
  },
});

export const {
  openRules,
  toggleRules,
  closeRules,
  toggleMenu,
  closeMenu,
  openMenu,
} = menuSlice.actions;

export default menuSlice.reducer;
