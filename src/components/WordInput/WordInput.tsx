import {createRef, RefObject, useMemo, useRef, useState} from "react";
import {Grid, TextField} from "@mui/material";

function WordInput() {
    const letterCount = 5;
    const [word, setWord] = useState(Array(letterCount).fill(null))
    const refs = useMemo(() => Array(letterCount).fill(null).map(() => useRef()), []);

    function handleChange(index: number, value: string) {
        const newWord = [...word]
        newWord[index] = value
        setWord(newWord)

        const nextInput = refs[index + 1]

        if (nextInput instanceof HTMLInputElement) {
            nextInput!.current.focus();
        }

        console.log(refs)
        console.log(index, value)
    }

    return (
        <>
            {word.map((letter, index) => {
                console.log(index)
                console.log(refs)
                return <Grid item xs={1} key={index}>
                    <TextField
                        variant="outlined"
                        size="small"
                        value={letter}
                        onChange={(e) => handleChange(index, e.target.value)}
                        inputProps={{maxLength: 1}}
                        autoFocus={index === 0}
                        inputRef={refs[index]}
                    />
                </Grid>
            })}
        </>
    );
}

export default WordInput;

