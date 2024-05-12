import { Box, Button, Stack, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../hooks.ts";
import { openMenu, openRules } from "../../features/menu/menuSlice.ts";

function Header() {
  const { category } = useAppSelector((state) => state.game);
  const dispatch = useAppDispatch();

  const showRules = () => {
    dispatch(openMenu());
    dispatch(openRules());
  };

  return (
    <Stack
      direction="row"
      color="secondary.main"
      sx={{
        background: "linear-gradient(to left, #2892e6, #82c1f2)",
        position: "fixed",
        width: "100%",
        zIndex: 2
      }}
      justifyContent={{ sm: "center" }}
      alignItems="center"
      textAlign="center"
      mb="30px"
      py="10px"
      px="30px"
    >
      <Box>
        <Typography variant="h4" fontWeight="bold">
          Игра в слова
        </Typography>
        <Typography>
          Тема:
          <span style={{ fontWeight: "bold" }}> {category?.label ?? ""}</span>
        </Typography>
      </Box>
      <Box position="absolute" right="30px">
        <Button onClick={showRules} variant="outlined" color="secondary">
          Правила
        </Button>
      </Box>
    </Stack>
  );
}

export default Header;
