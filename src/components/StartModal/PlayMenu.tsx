import { Button, ButtonGroup, Stack, Typography } from "@mui/material";
import categories from "../../categories.json";
import HowToPlayAccordion from "./HowToPlayAccordion.tsx";
import { useAppDispatch, useAppSelector } from "../../hooks.ts";
import { closeMenu, closeRules } from "../../features/menu/menuSlice.ts";
import { useState } from "react";
import { TCategory } from "../../hooks/useGameword.ts";
import { loadWords, startGame } from "../../features/game/gameSlice.ts";
function PlayMenu() {
  const dispatch = useAppDispatch();
  const { isStarted } = useAppSelector((state) => state.game);
  const [category, setCategory] = useState<TCategory | null>(null);

  const resume = () => {
    dispatch(closeMenu());
    dispatch(closeRules());
  };

  const play = () => {
    if (!category) {
      return;
    }

    resume();
    dispatch(startGame(category));
    dispatch(loadWords(category.id));
  };

  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      maxWidth="500px"
      flexGrow={1}
      mb="40px"
      spacing="10px"
    >
      <Typography variant="h3" fontWeight="bold">
        Игра в слова
      </Typography>
      <Stack spacing="15px">
        <ButtonGroup>
          {!isStarted &&
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
          disabled={category === undefined}
          onClick={isStarted ? resume : play}
          variant="contained"
        >
          {isStarted ? "Продолжить" : "Играть"}
        </Button>
      </Stack>
      <HowToPlayAccordion />
    </Stack>
  );
}

export default PlayMenu;
