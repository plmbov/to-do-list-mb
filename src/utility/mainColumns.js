import { v4 as uuid } from "uuid";

const mainColumns = {
  [uuid()]: {
    name: "Do zrobienia",
    items: [],
  },
  [uuid()]: {
    name: "W trakcie",
    items: [],
  },
  [uuid()]: {
    name: "Zrobione",
    items: [],
  },
};

export default mainColumns;
