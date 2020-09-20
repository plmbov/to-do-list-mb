import React from "react";
import itemFunctions from "../controllers/itemFunctions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashAlt,
  faStar,
  faStarHalf,
} from "@fortawesome/free-solid-svg-icons";

const Item = (props) => {
  let starIcon = null;

  if (props.columns[props.columnId].name === "In progress") {
    starIcon = <FontAwesomeIcon icon={faStarHalf} className="starIcon" />;
  }
  if (props.columns[props.columnId].name === "Done") {
    starIcon = <FontAwesomeIcon icon={faStar} className="starIcon" />;
  }

  return (
    <div
      ref={props.provided.innerRef}
      {...props.provided.draggableProps}
      {...props.provided.dragHandleProps}
      className="singleItem"
      style={{
        background: props.snapshot.isDragging ? "#F7F9FB" : "#fff",
        boxShadow: props.snapshot.isDragging
          ? " 0px 0px 10px 0px rgba(204,204,204,1)"
          : "none",
        ...props.provided.draggableProps.style,
      }}
    >
      <div>
        <div style={{ display: "flex" }}>
          <input
            ref={props.clickOutsideRef}
            className="itemTitle"
            type="text"
            value={props.item.content.title}
            title={props.item.content.title}
            onChange={(e) => {
              itemFunctions.editItem(
                e,
                props.item.id,
                "title",
                props.columnId,
                props.columns,
                props.setColumns,
                props.maxCharactersReached,
                props.setMaxCharactersReached
              );
              props.setItemTitleSelected(props.item.id);
            }}
            placeholder="Write the title..."
            onClick={() => {
              props.setItemTitleSelected(props.item.id);
            }}
          />
          <span
            className="exclamationMark"
            style={{
              visibility:
                (!props.newItemAdded &&
                  props.item.content.title === "" &&
                  !props.itemTitleSelected !== props.item.id) ||
                (props.item.content.title === "" &&
                  [...props.listOfItemTitles].filter(
                    (title) => title.value === ""
                  ).length > 1)
                  ? "visible"
                  : "hidden",
            }}
          >
            &nbsp;&nbsp;!&nbsp;&nbsp;
          </span>
          {starIcon}
        </div>
        <textarea
          className="itemNotes"
          type="text"
          value={props.item.content.notes}
          onChange={(e) =>
            itemFunctions.editItem(
              e,
              props.item.id,
              "notes",
              props.columnId,
              props.columns,
              props.setColumns,
              props.maxCharactersReached,
              props.setMaxCharactersReached
            )
          }
          placeholder="Write a note..."
        />
      </div>
      <button
        onClick={() => {
          itemFunctions.removeItem(
            props.item.id,
            props.columnId,
            props.columns,
            props.setColumns
          );
          props.setShowWarning(false);
        }}
        className="deleteButton"
        ref={props.clickOutsideRef}
      >
        <FontAwesomeIcon icon={faTrashAlt} />
      </button>
    </div>
  );
};

export default Item;
