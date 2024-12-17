import { FC, useState, useEffect, SetStateAction, Dispatch } from "react";
import { controller } from "../App";
import { Field } from "../lib/Model";
import styles from "./StudentTag.module.css";

interface StudentTagProps {
  initialField: Field;
  setSelectedField: Dispatch<SetStateAction<Field | undefined>>;
  selectNeighborsForId: Field["id"];
}

export const StudentTag: FC<StudentTagProps> = ({
  initialField,
  setSelectedField,
  selectNeighborsForId,
}) => {
  const [field, setField] = useState<Field>(initialField);

  const handleClick = () => {
    if (selectNeighborsForId && field.student) {
      if (selectNeighborsForId === field.id) {
        return;
      }
      const neighborField = controller.getFieldById(selectNeighborsForId);
      if (neighborField.student) {
        controller.setStudent(selectNeighborsForId, {
          forbiddenNeighbors: [
            ...new Set([
              ...neighborField.student.forbiddenNeighbors,
              field.student.name,
            ]),
          ],
        });
      }
    } else if (selectNeighborsForId === "") {
      setSelectedField(field);
    }
  };

  useEffect(() => {
    controller.observe(field.id, setField);
    return () => controller.removeObserver(field.id, setField);
  }, [field.id]);

  return field.student ? (
    <button
      className={styles.studentTag}
      onClick={handleClick}
      disabled={field.id === selectNeighborsForId}
    >
      {field.student.name}
    </button>
  ) : null;
};
