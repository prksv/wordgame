
export type Category = {
    label: string;
    id: string;
};

export type TInput = {
    isUserMove: boolean;
    status?: TInputStatus;
    value: string;
};

export type TInputStatus = "success" | "error";

export type TSubmitError = {
    inputId: number;
    message: string;
};

export type TGameStatus = "started" | "waiting" | "lose" | "win";

export interface GameState {
    category?: Category;
    status: TGameStatus;
    isHintsEnabled: boolean;
    winReason: string;
    loseReason: string;
    inputs: TInput[];
    words: string[];
    usedWords: string[];
}
