import { Box, InputBase } from "@mui/material";
import { RefObject } from "react";
import useWordInput from "../../hooks/useWordInput.ts";
import {TInputStatus} from "../../features/game/gameSlice.types.ts";

interface LetterInputProps {
  isUserMove: boolean;
  index: number;
  value: string;
  handleChange: ReturnType<typeof useWordInput>["handleChange"];
  handleKeyDown: ReturnType<typeof useWordInput>["handleKeyDown"];
  focusOn: number;
  letterRef: RefObject<unknown>;
  status?: TInputStatus;
  disabled: boolean;
}

function LetterInput({
  isUserMove,
  index,
  handleChange,
  handleKeyDown,
  focusOn,
  value,
  letterRef,
  status,
  disabled,
}: LetterInputProps) {
  const getStatusColor = () => {
    switch (status) {
      case "error":
        return "#dfcbcb";
      case "success":
        return "#ccdfcb";
      default:
        return "#cbd9df";
    }
  };

  return (
    <Box key={index} borderRadius="5px" bgcolor={getStatusColor()}>
      <InputBase
        disabled={!isUserMove || disabled}
        color="info"
        size="medium"
        value={value}
        onChange={(e) => handleChange(index, e.target.value)}
        onKeyDown={(e) => handleKeyDown(index, e)}
        inputProps={{
          style: {
            textAlign: "center",
            padding: "5px 5px",
            fontSize: "30px",
            color: "text.primary",
            textTransform: "uppercase",
            fontWeight: "500",
          },
        }}
        autoFocus={index === focusOn}
        style={{ width: "60px", height: "60px" }}
        inputRef={letterRef}
      />
    </Box>
  );
}

export default LetterInput;
