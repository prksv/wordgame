import { Collapse, Stack, Typography } from "@mui/material";
import useWordInput from "../../hooks/useWordInput.ts";
import LetterInput from "./LetterInput.tsx";
import { TransitionGroup } from "react-transition-group";
import useGameword from "../../hooks/useGameword.ts";
import { TInputStatus } from "../../features/game/gameSlice.ts";

export interface WordInputInterface {
  minSlots?: number;
  onSubmit: ReturnType<typeof useGameword>["onSubmit"];
  value?: string;
  inputId: number;
  isUserMove: boolean;
  status?: TInputStatus;
  disabled: boolean;
}

function WordInput({
  disabled,
  minSlots = 3,
  onSubmit,
  value,
  inputId,
  isUserMove,
  status,
}: WordInputInterface) {
  const { word, handleKeyDown, handleChange, focusOn } = useWordInput(
    inputId,
    minSlots,
    onSubmit,
    value,
    status,
  );

  function You() {
    return <span style={{ fontWeight: "bold" }}>Вы</span>;
  }

  return (
    <Stack>
      <Typography>{isUserMove ? <You /> : "Бот"}</Typography>
      <Stack
        direction="row"
        gap="10px"
        borderRadius="10px"
        p="5px"
        overflow="auto"
      >
        <TransitionGroup component={null}>
          {word.map((letter, index) => (
            <Collapse
              key={index}
              style={{ minWidth: "auto" }}
              orientation="horizontal"
              timeout={{ exit: 50, enter: 200 }}
            >
              <LetterInput
                disabled={disabled}
                status={status}
                key={index}
                index={index}
                handleChange={handleChange}
                handleKeyDown={handleKeyDown}
                isUserMove={isUserMove}
                focusOn={focusOn}
                value={letter.value}
                letterRef={letter.ref}
              />
            </Collapse>
          ))}
        </TransitionGroup>
      </Stack>
    </Stack>
  );
}

export default WordInput;
