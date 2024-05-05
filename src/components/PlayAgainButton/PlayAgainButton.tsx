import { Button, Fade } from "@mui/material";
import { useAppDispatch } from "../../hooks.ts";
import { setGameStatus } from "../../features/game/gameSlice.ts";
import { openMenu } from "../../features/menu/menuSlice.ts";

function PlayAgainButton({ isVisible }: { isVisible: boolean }) {
  const dispatch = useAppDispatch();
  const playAgain = () => {
    dispatch(setGameStatus("waiting"));
    dispatch(openMenu());
  };

  return (
    <Fade in={isVisible}>
      <div>
        <Button onClick={playAgain} variant="contained">
          Начать заново
        </Button>
      </div>
    </Fade>
  );
}

export default PlayAgainButton;
