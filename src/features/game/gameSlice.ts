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
import { Category, GameState, TGameStatus, TInput } from "./gameSlice.types.ts";
import Fuse from "fuse.js";
import { createAlert } from "../alerts/alertsSlice.ts";

const initialState: GameState = {
  inputs: [],
  isHintsEnabled: false,
  status: "waiting",
  words: [],
  usedWords: [],
  winReason: "У соперника закончились слова",
  loseReason: "Вы сдались",
};

const SKIP_LETTERS = ["ь", "ъ", "й", "ы"];

const formatWord = (word: string) => {
  const regexp = new RegExp(SKIP_LETTERS.join("|"), "g");

  return word.replace(regexp, "");
};

export const loadWords = createAsyncThunk(
  "game/loadWords",
  async (categoryId: string) => {
    const { data } = await axios.get(`words/${categoryId}.txt`, {
      responseEncoding: "utf-8",
    });

    return data.trim().split("\n").map((word: string) => word.trim());
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
      dispatch(makeBotMove());
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

    const { words, isHintsEnabled, usedWords } = game;

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

    if (!words.includes(word)) {
      if (isHintsEnabled) {
        const found = await dispatch(checkSimilarWords(word)).unwrap();

        if (found) {
          return;
        }
      }

      return rejectWithValue({
        inputId,
        message: "Слово не подходит!",
      });
    }

    if (usedWords.includes(word)) {
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

export const checkSimilarWords = createAsyncThunk(
  "game/findSimilarWords",
  async (word: string, { dispatch, getState }) => {
    const { game } = getState() as RootState;

    let prevWord: string|undefined;

    if (game.inputs.length >= 2) {
        prevWord = game.inputs[game.inputs.length - 2].value;
    }

    const availableWords = selectAvailableWords(getState(), prevWord);

    const fuse = new Fuse(availableWords, {
      minMatchCharLength: 3,
      includeScore: true,
    });

    const possibleWords = fuse.search(word, {
      limit: 1,
    });

    if (possibleWords.length <= 0) {
      return false;
    }

    if ((possibleWords[0].score ?? 0) <= 0.001) {
      return false;
    }

    dispatch(
      createAlert({
        type: "info",
        message: `Возможно, Вы имели ввиду слово "${possibleWords[0].item.toUpperCase()}"?`,
      }),
    );
    return true;
  },
);

export const makeBotMove = createAsyncThunk(
  "game/botMove",
  async (previousWord: string | undefined, { getState, dispatch }) => {
    const availableWords = selectAvailableWords(getState(), previousWord);

    if (availableWords.length <= 0) {
      dispatch(setGameStatus("win"));
      return;
    }

    const takenWord = _.sample(availableWords)!;

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

export const selectAvailableWords = createSelector(
  [
    (state: RootState) => state.game,
    (_, previousWord: string | undefined) => previousWord,
  ],
  (game, previousWord) => {
    if (!previousWord) {
      return game.words;
    }

    return game.words.filter(
      (word) =>
        !game.usedWords.includes(word) &&
        formatWord(word)[0] == _.last(formatWord(previousWord)),
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

    toggleHints: (state) => {
      state.isHintsEnabled = !state.isHintsEnabled;
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
  toggleHints,
} = gameSlice.actions;

export default gameSlice.reducer;
