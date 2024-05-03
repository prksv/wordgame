import * as fs from "fs";

const cities = fs.readFileSync("src/words/russian_cities.txt", {
  encoding: "utf8",
});

fs.writeFileSync("src/words/russian_cities.txt", cities.toLowerCase());
