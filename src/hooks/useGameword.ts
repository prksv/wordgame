import { useAppDispatch } from "../hooks.ts";
import { submitWordTest } from "../features/game/gameSlice.ts";

export type TCategory = {
  label: string;
  id: string;
};

function useGameword() {
  const dispatch = useAppDispatch();

  const onSubmit = (inputId: number, word: string) => {
    dispatch(submitWordTest({ inputId, word }));
  };

  return { onSubmit };
}

export default useGameword;
