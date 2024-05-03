import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import _ from "lodash";
import { RootState } from "../../store.ts";

export type Category = {
  label: string;
  id: string;
};

type TInput = {
  isUserMove: boolean;
  status?: TInputStatus;
  value: string;
};

export type TInputStatus = "success" | "error";

export type TSubmitError = {
  inputId: number;
  message: string;
};

const SKIP_LETTERS = ["ь", "ъ", "й", "ы"];

const filterWord = (word: string) => {
  const regexp = new RegExp(SKIP_LETTERS.join("|"), "g");

  return word.replace(regexp, "");
};

export interface GameState {
  category?: Category;
  isStarted: boolean;
  isUserMove: boolean;
  inputs: TInput[];
  words: string[];
}

const initialState: GameState = {
  inputs: [],
  isStarted: false,
  isUserMove: false,
  words: [],
};

export const loadWords = createAsyncThunk(
  "game/loadWords",
  async (categoryId: string) => {
    const { data } = await axios.get(`words/${categoryId}.txt`, {
      responseEncoding: "utf-8",
    });

    return data.split("\r\n");
  },
);

export const submitWordTest = createAsyncThunk(
  "game/submitWord",
  async (
    { inputId, word }: { inputId: number; word: string },
    { getState, dispatch, rejectWithValue },
  ) => {
    const { game } = getState() as RootState;

    if (inputId > 0) {
      const { value } = game.inputs[inputId - 1];

      const lastLetter = _.last(filterWord(value));

      if (lastLetter !== word[0]) {
        return rejectWithValue({
          inputId,
          message: `Слово не начинается на букву "${lastLetter?.toUpperCase()}"!`,
        });
      }
    }

    if (!game.words.includes(word)) {
      return rejectWithValue({
        inputId,
        message: "Слово не подходит!",
      });
    }

    dispatch(
      setInputValue({
        inputIndex: inputId,
        value: word,
      }),
    );

    dispatch(setInputSuccess(inputId));
    dispatch(makeBotMove(word));
  },
);

export const makeBotMove = createAsyncThunk(
  "game/botMove",
  async (previousWord: string, { getState, dispatch }) => {
    const { game } = getState() as RootState;
    const words = [...game.words];

    const filteredWord = filterWord(previousWord);

    const takenWord = _.sample(
      words.filter((word) => word[0] == filteredWord[filteredWord.length - 1]),
    )!;

    words.splice(words.indexOf(takenWord), 1);

    dispatch(addInput({ isUserMove: false, value: takenWord }));

    dispatch(
      addInput({
        isUserMove: true,
        value: _.last(filterWord(takenWord))!,
      }),
    );
  },
);

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setCategory: (state, { payload }: PayloadAction<Category>) => {
      state.category = payload;
    },

    setInputError: (state, { payload }: PayloadAction<number>) => {
      state.inputs[payload].status = "error";
    },

    setInputSuccess: (state, { payload }: PayloadAction<number>) => {
      state.inputs[payload].status = "success";
    },

    setGameStarted: (state, { payload }: PayloadAction<boolean>) => {
      state.isStarted = payload;
    },

    startGame: (state, { payload }: PayloadAction<Category>) => {
      state.isStarted = true;
      state.category = payload;
      state.inputs.push({ isUserMove: true, value: "" });
    },

    setInputValue: (
      state,
      { payload }: PayloadAction<{ inputIndex: number; value: string }>,
    ) => {
      state.inputs[payload.inputIndex].value = payload.value.toLowerCase();
    },

    claimWord: (state, { payload }: PayloadAction<number>) => {
      const newWords = [...state.words];
      newWords.splice(payload, 1);
      state.words = newWords;
    },

    addInput: (state, { payload }: PayloadAction<TInput>) => {
      state.inputs.push({
        isUserMove: payload.isUserMove,
        status: payload?.status,
        value: payload.value,
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadWords.fulfilled, (state, { payload }) => {
      state.words = payload;
    });

    builder.addCase(
      submitWordTest.rejected,
      (state, { payload }: PayloadAction<TSubmitError>) => {
        state.inputs[payload.inputId].status = "error";
      },
    );
  },
});

export const {
  setCategory,
  setGameStarted,
  startGame,
  setInputValue,
  addInput,
  setInputError,
  setInputSuccess,
  claimWord,
} = gameSlice.actions;

export default gameSlice.reducer;
