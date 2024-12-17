import { FC, useState, useEffect, CSSProperties } from "react";
import { useDrop } from "react-dnd";
import { ItemTypes } from "../lib/Constants";
import { controller } from "../App";
import { Field, TrashedField } from "../lib/Model";
import { StudentComp } from "./Student";
import RemoveStudentIcon from "../assets/person-remove-outline.svg";
import styles from "./RecycleBin.module.css";

export const RecycleBin: FC = () => {
  const [trash, setTrash] = useState<TrashedField[]>([]);
  const [showTrashContent, setShowTrashContent] = useState(false);

  useEffect(() => controller.observe("recycleBin", setTrash), []);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.FIELD,
    drop: (field: Field) => {
      controller.resetField(field);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const renderTrashContainer = () => {
    const trashedStudents = trash.filter((field) => field.student);
    if (trashedStudents.length > 0) {
      return trashedStudents.map((field) => (
        <li key={field.id} className={styles.trashedField}>
          <StudentComp field={field} />
        </li>
      ));
    } else {
      setTimeout(() => setShowTrashContent(false), 4000);
      return <p>Momentan sind keine Schüler:innen entfernt worden.</p>;
    }
  };

  const dropStyles: CSSProperties = {
    transform: `translateY(-3px)`,
    transition: `transform 150ms ease`,
  };

  return (
    <>
      {showTrashContent && (
        <div className={styles.trashedFieldsContainer}>
          <button
            className={styles.closeTrashContentButton}
            onClick={() => setShowTrashContent((prevShow) => !prevShow)}
          >
            &times;
          </button>
          {renderTrashContainer()}
        </div>
      )}
      <div
        className={styles.recycleBin}
        ref={drop}
        onClick={() => setShowTrashContent((prevShow) => !prevShow)}
      >
        <img
          className={styles.icon}
          style={isOver ? dropStyles : undefined}
          src={RemoveStudentIcon}
          alt=""
        />
      </div>
    </>
  );
};
