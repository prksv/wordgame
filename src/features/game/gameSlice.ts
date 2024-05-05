import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";
import _ from "lodash";
import { RootState } from "../../store.ts";
import { TCategory } from "../../hooks/useGameword.ts";

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

const formatWord = (word: string) => {
  const regexp = new RegExp(SKIP_LETTERS.join("|"), "g");

  return word.replace(regexp, "");
};

export type TGameStatus = "started" | "waiting" | "lose" | "win";

export interface GameState {
  category?: Category;
  status: TGameStatus;
  winReason: string;
  loseReason: string;
  inputs: TInput[];
  words: string[];
  usedWords: string[];
}

const initialState: GameState = {
  inputs: [],
  status: "waiting",
  words: [],
  usedWords: [],
  winReason: "У соперника закончились слова",
  loseReason: "Вы сдались",
};

export const loadWords = createAsyncThunk(
  "game/loadWords",
  async (categoryId: string) => {
    const { data } = await axios.get(`words/${categoryId}.txt`, {
      responseEncoding: "utf-8",
    });

    return data.split("\n");
  },
);

export const startGame = createAsyncThunk(
  "game/start",
  async (
    {
      category,
      isUserFirstMove,
    }: {
      category: TCategory;
      isUserFirstMove: boolean;
    },
    { dispatch },
  ) => {
    dispatch(setCategory(category));
    dispatch(setInputs([]));
    await dispatch(loadWords(category.id));

    if (isUserFirstMove) {
      dispatch(
        addInput({
          isUserMove: true,
          value: "",
        }),
      );
    } else {
      dispatch(makeBotMove(null));
    }

    dispatch(setGameStatus("started"));
  },
);

export const submitWord = createAsyncThunk(
  "game/submitWord",
  async (
    { inputId, word }: { inputId: number; word: string },
    { getState, dispatch, rejectWithValue },
  ) => {
    const { game } = getState() as RootState;

    if (inputId > 0) {
      const { value } = game.inputs[inputId - 1];

      const lastLetter = _.last(formatWord(value));

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

    if (game.usedWords.includes(word)) {
      return rejectWithValue({
        inputId,
        message: "Слово уже использовалось!",
      });
    }

    dispatch(claimWord(word));

    dispatch(setInputSuccess(inputId));
    dispatch(makeBotMove(word));
  },
);

export const makeBotMove = createAsyncThunk(
  "game/botMove",
  async (previousWord: string | null, { getState, dispatch }) => {
    const { game } = getState() as RootState;
    const words = [...game.words];

    const availableWords = previousWord
      ? selectAvailableWords(getState(), previousWord)
      : selectNotTakenWords(getState() as RootState);
    console.log(availableWords);
    if (availableWords.length <= 0) {
      dispatch(setGameStatus("win"));
      return;
    }

    const takenWord = _.sample(availableWords)!;

    words.splice(words.indexOf(takenWord), 1);

    dispatch(addInput({ isUserMove: false, value: takenWord }));
    dispatch(claimWord(takenWord));

    dispatch(
      addInput({
        isUserMove: true,
        value: _.last(formatWord(takenWord))!,
      }),
    );
  },
);

const selectNotTakenWords = (state: RootState) => {
  return state.game.words.filter(
    (word) => !state.game.usedWords.includes(word),
  );
};

export const selectAvailableWords = createSelector(
  [
    (state: RootState) => state.game,
    (_, searchWord: string | undefined) => searchWord,
  ],
  (game, searchWord) => {
    if (!searchWord) {
      return game.words;
    }

    return game.words.filter(
      (word) =>
        !game.usedWords.includes(word) &&
        formatWord(word)[0] == _.last(formatWord(searchWord)),
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

    setGameStatus: (state, { payload }: PayloadAction<TGameStatus>) => {
      state.status = payload;
    },

    startGame: (state, { payload }: PayloadAction<Category>) => {
      state.status = "started";
      state.category = payload;
      state.inputs = [];
      state.inputs.push({ isUserMove: true, value: "" });
    },

    setInputs: (state, { payload }: PayloadAction<TInput[]>) => {
      state.inputs = payload;
    },

    setInputValue: (
      state,
      { payload }: PayloadAction<{ inputIndex: number; value: string }>,
    ) => {
      state.inputs[payload.inputIndex].value = payload.value.toLowerCase();
    },

    claimWord: (state, { payload }: PayloadAction<string>) => {
      state.usedWords.push(payload);
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
      state.usedWords = [];
    });
  },
});

export const {
  setCategory,
  setGameStatus,
  setInputValue,
  addInput,
  setInputError,
  setInputSuccess,
  claimWord,
  setInputs,
} = gameSlice.actions;

export default gameSlice.reducer;
