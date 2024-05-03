import React, { createRef, useCallback, useEffect, useState } from "react";

function useWordInput(
  inputId: number,
  minSlots: number,
  onSubmit: any,
  value?: string,
) {
  const [word, setWord] = useState(
    Array((value?.length ?? 0) > minSlots ? value?.length : minSlots)
      .fill(null)
      .map((_, key) => {
        return {
          value: value?.[key] ?? "",
          ref: createRef(),
        };
      }),
  );

  const [focusOn, setFocusOn] = useState(0);

  const getWord = useCallback(() => {
    return word
      .map((letter) => letter.value)
      .join("")
      .trim();
  }, [word]);

  useEffect(() => {
    if (!value) {
      return;
    }
    setFocusOn(value.length);
  }, [value]);

  useEffect(() => {
    if (!word[focusOn]) {
      return;
    }
    const ref = word[focusOn].ref.current;

    if (ref instanceof HTMLInputElement) {
      ref.focus();
    }
  }, [word, focusOn]);

  function handleChange(index: number, value: string) {
    if (value == "") {
      return;
    }

    const newWord = [...word];

    newWord[index].value = value[0];

    if (index == word.length - 1 && value.length > 1) {
      newWord.push({ value: value[1], ref: createRef() });
    }

    setWord(newWord);

    if (index < newWord.length - 1) {
      setFocusOn(index + 1);
    }
  }

  function handleKeyDown(
    index: number,
    event: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) {
    if (event.key === "Enter") {
      onSubmit(inputId, getWord());
    }

    if (event.key === "Backspace") {
      deleteSlot(index);
    }
  }

  function deleteSlot(index: number) {
    const newWord = [...word];

    if (index < minSlots) {
      newWord[index].value = "";
    } else {
      newWord.splice(index, 1);
    }

    if (index !== 0) {
      setFocusOn(index - 1);
    }

    setWord(newWord);
  }

  return {
    handleChange,
    handleKeyDown,
    word,
    setWord,
    setFocusOn,
    focusOn,
    getWord,
  };
}

export default useWordInput;
