import './App.css'
import {Box, Container, FormControl, Grid, InputBase, Stack, TextField, Typography} from "@mui/material";
import WordInput from "./components/WordInput/WordInput.tsx";

function App() {

  return (
      <Container>
        <Box>
          <Stack direction="row">
            <WordInput />
          </Stack>
        </Box>
      </Container>
  )
}

export default App
