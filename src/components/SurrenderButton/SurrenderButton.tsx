import { Button, Stack, Typography } from "@mui/material";
import {
  selectAvailableWords,
  setGameLose,
} from "../../features/game/gameSlice.ts";
import { useMemo } from "react";
import _ from "lodash";
import { useAppDispatch, useAppSelector } from "../../hooks.ts";

function SurrenderButton() {
  const dispatch = useAppDispatch();
  const { inputs } = useAppSelector((state) => state.game);

  const lastEnemyInput = useMemo(
    () => _.last(inputs.filter((input) => !input.isUserMove)),
    [inputs],
  );

  const availableWords = useAppSelector((state) =>
    selectAvailableWords(state, lastEnemyInput?.value),
  );
  const surrender = () => {
    dispatch(setGameLose("Вы сдались"));
  };

  return (
    <Stack justifyContent="center" alignItems="center" width="100%">
      {availableWords.length <= 0 && (
        <Typography sx={{ opacity: 0.5 }} mb="10px">
          Похоже, что подходящих слов не осталось...
        </Typography>
      )}
      <Button
        fullWidth={true}
        color="error"
        variant={availableWords.length > 0 ? "outlined" : "contained"}
        onClick={surrender}
      >
        Сдаться
      </Button>
    </Stack>
  );
}

export default SurrenderButton;
