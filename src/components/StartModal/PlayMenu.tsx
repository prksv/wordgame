import {
  Button,
  ButtonGroup,
  Checkbox,
  FormControlLabel,
  Stack,
  Typography,
} from "@mui/material";
import categories from "../../categories.json";
import HowToPlayAccordion from "./HowToPlayAccordion.tsx";
import { useAppDispatch, useAppSelector } from "../../hooks.ts";
import { closeMenu, closeRules } from "../../features/menu/menuSlice.ts";
import { useState } from "react";
import { TCategory } from "../../hooks/useGameword.ts";
import { startGame, toggleHints } from "../../features/game/gameSlice.ts";

function PlayMenu() {
  const dispatch = useAppDispatch();
  const { status, isHintsEnabled } = useAppSelector((state) => state.game);
  const [category, setCategory] = useState<TCategory | null>(null);
  const [isUserFirstMove, setUserFirstMove] = useState<boolean>(true);

  const resume = () => {
    dispatch(closeMenu());
    dispatch(closeRules());
  };

  const play = () => {
    if (!category) {
      return;
    }

    resume();
    dispatch(startGame({ category, isUserFirstMove }));
  };

  return (
    <Stack justifyContent="center" alignItems="center" flexGrow={1} mb="40px">
      <Typography variant="h3" fontWeight="bold">
        Игра в слова
      </Typography>
      <Stack sx={{ mb: "10px", mt: "20px" }}>
        <ButtonGroup sx={{ mb: "15px" }}>
          {status == "waiting" &&
            categories.map((gameCategory, key) => {
              return (
                <Button
                  key={key}
                  onClick={() => setCategory(gameCategory)}
                  variant={
                    gameCategory.id === category?.id ? "contained" : "outlined"
                  }
                >
                  {gameCategory.label}
                </Button>
              );
            })}
        </ButtonGroup>
        <Button
          disabled={category === null && status == "waiting"}
          onClick={status == "started" ? resume : play}
          variant="contained"
        >
          {status == "started" ? "Продолжить" : "Играть"}
        </Button>
        <Stack direction="column" justifyContent="center" alignItems="center" mt="10px">
          <FormControlLabel
            sx={{ color: "text.primary", mr: "0" }}
            label="Включить подсказки"
            control={
              <Checkbox
                checked={isHintsEnabled}
                onChange={() => dispatch(toggleHints())}
              />
            }
          />
          {status == "waiting" && (
            <FormControlLabel
              sx={{ color: "text.primary", mr: "0" }}
              control={
                <Checkbox
                  checked={isUserFirstMove}
                  onChange={() => setUserFirstMove(!isUserFirstMove)}
                />
              }
              label="Я хожу первым"
            />
          )}
        </Stack>
      </Stack>
      <HowToPlayAccordion />
    </Stack>
  );
}

export default PlayMenu;
