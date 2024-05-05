import { Fade, Modal, Stack, Typography } from "@mui/material";
import { useWindowSize } from "react-use";
import Confetti from "react-confetti";
import { useState } from "react";
import PlayAgainButton from "../PlayAgainButton/PlayAgainButton.tsx";
import { useAppSelector } from "../../hooks.ts";

const style = {
  position: "absolute",
  width: "100%",
  height: "100%",
  bgcolor: "background.default",
  color: "primary.main",
  py: "50px",
};

function WinScreen() {
  const { width, height } = useWindowSize();

  const [isButtonVisible, setButtonVisible] = useState(false);
  const { winReason } = useAppSelector((state) => state.game);

  return (
    <Modal open={true}>
      <Fade
        timeout={{
          enter: 1000,
          exit: 1000,
        }}
        in={true}
      >
        <Stack
          sx={style}
          direction="column"
          justifyContent="center"
          alignItems="center"
          textAlign="center"
          spacing="15px"
        >
          <Confetti
            numberOfPieces={400}
            gravity={0.2}
            recycle={false}
            width={width}
            height={height}
            onConfettiComplete={() => setButtonVisible(true)}
          />
          <Fade in={true} timeout={2000}>
            <div>
              <Typography variant="h2" fontWeight="bold">
                Победа!
              </Typography>
              <Typography variant="h6">{winReason}</Typography>
            </div>
          </Fade>
          <PlayAgainButton isVisible={isButtonVisible} />
        </Stack>
      </Fade>
    </Modal>
  );
}

export default WinScreen;
