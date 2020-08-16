import { v4 as uuid } from "uuid";

const itemFunctions = {
  addNewItem: function (
    columnId,
    columns,
    setColumns,
    setShowWarning,
    setNewItemAdded,
    checkIfWarningNeeded
  ) {
    const column = columns[columnId];
    const copiedItems = [...column.items];
    let emptyItem = [];
    //Checking for empty items and storing then in emptyItem array in order [itemId, columnId]
    for (let i in columns) {
      if (
        columns[i].items.filter((item) => item.content.title === "").length > 0
      ) {
        emptyItem.push(
          columns[i].items.filter((item) => item.content.title === "")[0].id
        );
        emptyItem.push(i);
      }
    }

    //If a user wants to add a new item to a column that already has an empty item the logic below will focus the cursor on this empty title.
    if (emptyItem[1] === columnId) {
      const listOfItems = document.getElementsByClassName("itemTitle");
      for (let i in listOfItems) {
        if (listOfItems[i].value === "") {
          listOfItems[i].focus();
        }
        checkIfWarningNeeded();
      }
      //If a user wants to add a new item and an item with empty title already exists in one of other columns the empty item will be removed from the other column and created in the new column.
      //Only exception from above is when the item with empty title has a description added.
    } else if (emptyItem.length >= 2 && emptyItem[1] !== columnId) {
      const newItem = {
        id: uuid(),
        content: { title: "", notes: "" },
      };
      copiedItems.splice(0, 0, newItem);
      const copiedColumns = {
        ...columns,
        [columnId]: {
          ...column,
          items: copiedItems,
        },
      };
      const emptyItemContent = columns[emptyItem[1]].items.filter(
        (item) => item.id === emptyItem[0]
      )[0].content.notes;
      if (emptyItemContent === "") {
        itemFunctions.removeItem(
          emptyItem[0],
          emptyItem[1],
          copiedColumns,
          setColumns
        );
        setShowWarning(false);
      } else {
        setShowWarning(true);
      }
      setNewItemAdded(true);
    } else {
      const newItem = {
        id: uuid(),
        content: { title: "", notes: "" },
      };
      copiedItems.splice(0, 0, newItem);
      setColumns({
        ...columns,
        [columnId]: {
          ...column,
          items: copiedItems,
        },
      });
      setShowWarning(false);
      setNewItemAdded(true);
    }
  },

  editItem: async function (
    e,
    itemId,
    field,
    columnId,
    columns,
    setColumns,
    maxCharactersReached,
    setMaxCharactersReached
  ) {
    e.preventDefault();

    function sleep(time) {
      return new Promise((resolve) => setTimeout(resolve, time));
    }

    const column = columns[columnId];
    const copiedItems = [...column.items];
    let editedItem = copiedItems.find((item) => item.id === itemId);
    if (e.target.value.length <= 25 || field === "notes") {
      editedItem.content[field] = e.target.value;
      setColumns({
        ...columns,
        [columnId]: {
          ...column,
          items: copiedItems,
        },
      });
    } else {
      if (!maxCharactersReached) {
        setMaxCharactersReached(true);
        await sleep(1500);
        setMaxCharactersReached(false);
      }
    }
  },

  removeItem: function (itemId, columnId, columns, setColumns) {
    const column = columns[columnId];
    const copiedItems = [...column.items];
    const updatedItems = copiedItems.filter((item) => item.id !== itemId);

    setColumns({
      ...columns,
      [columnId]: {
        ...column,
        items: updatedItems,
      },
    });
  },
};

export default itemFunctions;
