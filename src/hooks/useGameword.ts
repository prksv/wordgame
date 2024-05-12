import { useAppDispatch } from "../hooks.ts";
import {
  setInputError,
  submitWord,
} from "../features/game/gameSlice.ts";
import { createAlert } from "../features/alerts/alertsSlice.ts";

export type TCategory = {
  label: string;
  id: string;
};

function useGameword() {
  const dispatch = useAppDispatch();

  const onSubmit = (inputId: number, word: string) => {
    dispatch(submitWord({ inputId, word }))
      .unwrap()
      .catch((err) => {
        dispatch(setInputError(inputId));
        dispatch(createAlert({ message: err.message, type: "error" }));
      });
  };

  return { onSubmit };
}

export default useGameword;
