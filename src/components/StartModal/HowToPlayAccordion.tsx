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
      <Link onClick={toggleRulesHandler} href="#" underline="always">
        Как играть?
      </Link>
      <Collapse in={isRulesOpen}>
        <Typography variant="subtitle1" component="p">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab eius
          error illo, nulla omnis quidem recusandae repellat soluta temporibus
          unde? A amet atque expedita, explicabo facere id inventore suscipit
          voluptas?
        </Typography>
      </Collapse>
    </>
  );
}

export default HowToPlayAccordion;
