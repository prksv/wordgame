import {Box, Container, Fade, Modal, Stack, Theme, Typography} from "@mui/material";
import { useAppSelector } from "../../hooks.ts";
import kguLogo from "../../assets/logo.svg";
import { useEffect, useState } from "react";
import PlayMenu from "./PlayMenu.tsx";

const style = {
  position: "absolute",
  width: "100%",
  height: "100%",
  background: ({palette}: Theme) => palette?.background?.defaultGradient,
  color: "primary.main",
  py: "50px",
  px: "20px",
};

function StartModal() {
  const { isOpen } = useAppSelector((state) => state.menu);
  const [isFirstLoad, setFirstLoad] = useState(true);

  useEffect(() => {
    setFirstLoad(false);
  }, []);

  return (
    <Modal open={isOpen}>
      <Fade
        timeout={{
          enter: isFirstLoad ? 0 : 1000,
          exit: 1000,
        }}
        in={isOpen}
      >
        <Stack
          sx={style}
          direction="column"
          justifyContent="center"
          alignItems="center"
          textAlign="center"
        >
          <PlayMenu />
          <Box position="absolute" width="100%" bottom="15px">
            <Container maxWidth="sm">
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <img
                  src={kguLogo}
                  style={{ width: "200px", marginBottom: "20px" }}
                  alt="КГУ"
                />
                <Typography textAlign="right" color="text.primary">
                  <span style={{ fontWeight: "bold" }}>Работу выполнил:</span>
                  <br />
                  Просеков Егор - студент 1 курса ИТ-0900023Б
                </Typography>
              </Stack>
            </Container>
          </Box>
        </Stack>
      </Fade>
    </Modal>
  );
}

export default StartModal;
