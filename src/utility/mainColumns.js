import { v4 as uuid } from "uuid";

const mainColumns = {
  [uuid()]: {
    name: "Planned",
    items: [],
  },
  [uuid()]: {
    name: "In progress",
    items: [],
  },
  [uuid()]: {
    name: "Done",
    items: [],
  },
};

export default mainColumns;
