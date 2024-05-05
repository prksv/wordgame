import { Fade, Modal, Stack, Typography } from "@mui/material";
import PlayAgainButton from "../PlayAgainButton/PlayAgainButton.tsx";
import { useAppSelector } from "../../hooks.ts";
import { useTimeout } from "react-use";

const style = {
  position: "absolute",
  width: "100%",
  height: "100%",
  bgcolor: "background.default",
  color: "primary.main",
  py: "50px",
};

function LoseScreen() {
  const { loseReason } = useAppSelector((state) => state.game);

  const [isButtonVisible] = useTimeout(2000);
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
          <Fade in={true} timeout={1000}>
            <div style={{ color: "#ec4851" }}>
              <Typography variant="h2" fontWeight="bold">
                Поражение!
              </Typography>
              <Typography variant="h6">{loseReason}</Typography>
            </div>
          </Fade>
          <PlayAgainButton isVisible={isButtonVisible() ?? false} />
        </Stack>
      </Fade>
    </Modal>
  );
}

export default LoseScreen;
