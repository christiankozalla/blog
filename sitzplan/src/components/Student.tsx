import { FC } from "react";
import { useDrag } from "react-dnd";
import { controller } from "../App";
import { ItemTypes } from "../lib/Constants";
import { Field } from "../lib/Model";
import styles from "./Student.module.css";

interface StudentCompProps {
  field: Field;
}

export const StudentComp: FC<StudentCompProps> = ({ field }) => {
  const [, drag] = useDrag({
    type: ItemTypes.FIELD,
    item: field,
  });

  if (field.student || field.isTable) {
    return (
      <div
        ref={drag}
        className={styles.student}
        onAuxClick={() => controller.toggleModal(true, field)}
        style={{
          backgroundColor: field.isTable
            ? "var(--color-primary-dark)"
            : "transparent",
        }}
      >
        {!field.student ? null : field.student.name.trim() || "Name fehlt!"}
      </div>
    );
  } else {
    return null;
  }
};
