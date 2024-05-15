import { Alert, Collapse, Container, Snackbar, Stack } from "@mui/material";
import WordInput from "./WordInput/WordInput.tsx";
import Header from "./Header/Header.tsx";
import StartModal from "./StartModal/StartModal.tsx";
import useGameword from "../hooks/useGameword.ts";
import { TransitionGroup } from "react-transition-group";
import { useAppSelector } from "../hooks.ts";
import {createRef, useEffect, useMemo} from "react";
import WinScreen from "./WinScreen/WinScreen.tsx";
import LoseScreen from "./LoseScreen/LoseScreen.tsx";
import SurrenderButton from "./SurrenderButton/SurrenderButton.tsx";
import { min } from "lodash";

function App() {
  const { onSubmit } = useGameword();
  const { inputs, status, words } = useAppSelector((state) => state.game);

  const alerts = useAppSelector((state) => state.alerts);

  const ref = createRef<HTMLDivElement>();

  const minSlots = useMemo(() => {
    return min([min(words)?.length ?? 0, 4]);
  }, [words]);

  useEffect(() => {
    setTimeout(() => {
      ref.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }, 200);
  }, [inputs.length, ref]);

  return (
    <>
      {status === "win" && <WinScreen />}
      {status === "lose" && <LoseScreen />}
      <StartModal />
      <Header />
      <Container
        sx={{
          visibility: status === "started" ? "visible" : "hidden",
          pt: "110px",
        }}
      >
        <Stack alignItems="center">
          <Stack gap="15px" pb="40vh" sx={{ maxWidth: "100%" }} ref={ref}>
            <TransitionGroup>
              {inputs.map(({ value, isUserMove, status }, key) => (
                <Collapse autoFocus={true} key={key}>
                  <WordInput
                    disabled={status == "success"}
                    status={status}
                    isUserMove={isUserMove}
                    key={key}
                    minSlots={minSlots}
                    inputId={key}
                    value={value}
                    onSubmit={onSubmit}
                  />
                </Collapse>
              ))}
            </TransitionGroup>
            <SurrenderButton />
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
