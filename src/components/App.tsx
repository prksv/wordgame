import { Alert, Collapse, Container, Snackbar, Stack } from "@mui/material";
import WordInput from "./WordInput/WordInput.tsx";
import Header from "./Header/Header.tsx";
import StartModal from "./StartModal/StartModal.tsx";
import useGameword from "../hooks/useGameword.ts";
import { TransitionGroup } from "react-transition-group";
import { useAppSelector } from "../hooks.ts";
import { useEffect, useRef } from "react";

function App() {
  const { onSubmit } = useGameword();
  const { inputs } = useAppSelector((state) => state.game);
  const alerts = useAppSelector((state) => state.alerts);

  const ref = useRef<null | HTMLDivElement>();

  useEffect(() => {
    setTimeout(() => {
      ref.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }, 100);
  }, [inputs]);

  return (
    <>
      <StartModal />
      <Header />
      <Container>
        <Stack alignItems="center">
          <Stack gap="15px" pb="40vh" sx={{ maxWidth: "100%" }} ref={ref}>
            <TransitionGroup>
              {inputs.map(({ value }, key) => (
                <Collapse autoFocus={true} key={key}>
                  <WordInput
                    key={key}
                    inputId={key}
                    value={value}
                    onSubmit={onSubmit}
                  />
                </Collapse>
              ))}
            </TransitionGroup>
          </Stack>

          {alerts.map(({ type, message, isOpen }, index) => {
            return (
              <Snackbar
                anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
                key={index}
                open={isOpen}
              >
                <Alert severity={type} variant="filled" sx={{ width: "100%" }}>
                  {message}
                </Alert>
              </Snackbar>
            );
          })}
        </Stack>
      </Container>
    </>
  );
}

export default App;
