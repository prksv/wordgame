import { Collapse, Link, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../hooks.ts";
import { toggleRules } from "../../features/menu/menuSlice.ts";

function HowToPlayAccordion() {
  const dispatch = useAppDispatch();
  const { isRulesOpen } = useAppSelector((state) => state.menu);

  const toggleRulesHandler = () => {
    dispatch(toggleRules());
  };

  return (
    <>
      <Link
        onClick={toggleRulesHandler}
        href="#"
        underline="always"
      >
        Как играть?
      </Link>
      <Collapse in={isRulesOpen}>
        <Typography
          variant="subtitle1"
          component="div"
          maxWidth="700px"
          color="text.primary"
        >
          <p>
            Участники выстраивают цепочку слов на выбранную тему: каждое новое
            начинается на ту же букву, какой оканчивается предыдущее.
            <br />
            Например: «Москв<b>а</b>» – «<b>А</b>мстерда<b>м</b>» – «<b>М</b>ила
            <b>н</b>» – «<b>Н</b>орильск» и так далее.
            <br />
          </p>
          <p>
            Участник каждый раз подбирает понятие на последнюю букву названного
            перед ним слова. Однако, следуя правилам русского языка, в игре
            предусмотрены исключения. <br />
            Если слово заканчивается на <b>Ь, Ъ, Ы, Й,</b> то подбирается слово на
            предпоследнюю букву.
          </p>
          <p>Наименования не должны повторяться, каждый раз придумывается новое.</p>
          <p>Проигравшим считается игрок, у которого закончились слова. Победителем - игрок, последним совершивший успешных ход.</p>
        </Typography>
      </Collapse>
    </>
  );
}

export default HowToPlayAccordion;
