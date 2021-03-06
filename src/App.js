import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import useOnclickOutside from "react-cool-onclickoutside";
import itemFunctions from "./controllers/itemFunctions";
import onDragEnd from "./controllers/onDragFunction";
import mainColumns from "./utility/mainColumns";
import Warning from "./components/Warning";
import Item from "./components/Item";
import "./App.css";

function App() {
  const [columns, setColumns] = useState(mainColumns);
  const [showWarning, setShowWarning] = useState(false);
  const [maxCharactersReached, setMaxCharactersReached] = useState(false);
  const [newItemAdded, setNewItemAdded] = useState(false);
  const [itemTitleSelected, setItemTitleSelected] = useState(null);

  const listOfItemTitles = document.getElementsByClassName("itemTitle");

  //This useEffect fetches columns saved in localStore. I have added this functionality to imitate working with backend.
  useEffect(() => {
    const fetchedColumns = JSON.parse(localStorage.getItem("columns"));
    if (fetchedColumns) {
      setColumns(fetchedColumns);
    }
  }, []);

  //This useEffect saves columns  in localStore. I have added this functionality to imitate working with backend.
  useEffect(() => {
    localStorage.setItem("columns", JSON.stringify(columns));
  }, [columns]);

  //The function checks if there is an item with empty title and shows a warning to user to add the title.
  //It is called when the user clicks outside of the empty title line or when the user wants to add more than one empty item to one column.
  const checkIfWarningNeeded = () => {
    for (let i in listOfItemTitles) {
      if (listOfItemTitles[i].value === "") {
        setShowWarning(true);
      }
    }
  };

  //The function is called when a user clicks outside empty line title or "Add new" button.
  const clickOutsideRef = useOnclickOutside(() => {
    checkIfWarningNeeded();
    setNewItemAdded(false);
  });

  //This useEffect is called when a new item is added. It focuses the cursor on the empty title of new item so a user can start typing immediately after adding a new item.
  useEffect(() => {
    if (newItemAdded) {
      for (let i of listOfItemTitles) {
        if (i.value === "") {
          i.focus();
        }
      }
    }
  }, [newItemAdded, listOfItemTitles]);

  //Limit the time of showing the warning.
  useEffect(() => {
    if (showWarning) {
      setTimeout(() => {
        setShowWarning(false);
      }, 2000);
    }
  }, [showWarning]);

  return (
    <div className="container">
      <div className="App">
        <header>
          <h1>
            Draggable ToDo App<span style={{ color: "#f8b102" }}>!</span>
          </h1>
          {showWarning && <Warning message="Missing note title" />}
          {maxCharactersReached && !showWarning && (
            <Warning message="Title can have max 25 characters" />
          )}
        </header>
        <div className="columnsContainer" key="columnsContainer">
          <DragDropContext
            onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
          >
            {Object.entries(columns).map(([columnId, column]) => {
              return (
                <div className="singleColumn" key={columnId}>
                  <div className="columnHeader">
                    <h2>
                      {column.name}{" "}
                      <span style={{ color: "#6C8091", fontWeight: 400 }}>
                        ({column.items.length})
                      </span>
                    </h2>
                    <button
                      className="newItemButton"
                      onClick={() =>
                        itemFunctions.addNewItem(
                          columnId,
                          columns,
                          setColumns,
                          setShowWarning,
                          setNewItemAdded,
                          checkIfWarningNeeded
                        )
                      }
                      ref={clickOutsideRef}
                    >
                      <p>Add new&nbsp;</p>
                      <p style={{ fontWeight: 300, fontSize: 20 }}>+</p>
                    </button>
                  </div>
                  <Droppable droppableId={columnId} key={columnId}>
                    {(provided, snapshot) => {
                      return (
                        <div
                          className="droppableColumn"
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          style={{
                            background: snapshot.isDraggingOver
                              ? "#eceaea4d"
                              : "transparent",
                          }}
                        >
                          {column.items.map((item, index) => {
                            return (
                              <Draggable
                                key={item.id}
                                draggableId={item.id}
                                index={index}
                              >
                                {(provided, snapshot) => {
                                  return (
                                    <Item
                                      provided={provided}
                                      snapshot={snapshot}
                                      clickOutsideRef={clickOutsideRef}
                                      item={item}
                                      listOfItemTitles={listOfItemTitles}
                                      columnId={columnId}
                                      columns={columns}
                                      setColumns={setColumns}
                                      showWarning={showWarning}
                                      setShowWarning={setShowWarning}
                                      maxCharactersReached={
                                        maxCharactersReached
                                      }
                                      setMaxCharactersReached={
                                        setMaxCharactersReached
                                      }
                                      itemTitleSelected={itemTitleSelected}
                                      setItemTitleSelected={
                                        setItemTitleSelected
                                      }
                                      newItemAdded={newItemAdded}
                                      setNewItemAdded={setNewItemAdded}
                                    />
                                  );
                                }}
                              </Draggable>
                            );
                          })}
                          {provided.placeholder}
                        </div>
                      );
                    }}
                  </Droppable>
                </div>
              );
            })}
          </DragDropContext>
        </div>
      </div>
    </div>
  );
}

export default App;
