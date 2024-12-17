import { FC, useState, useEffect, Dispatch, SetStateAction } from "react";
import { AddStudent } from "./AddStudent";
import { controller } from "../App";
import styles from "./Conditions.module.css";
import { StudentTag } from "./StudentTag";
import { Field } from "../lib/Model";
import { StudentEditor } from "./StudentEditor";
import { CheckboxSwitch } from "./CheckboxSwitch";

interface ConditionsProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  initialField?: Field;
}

export const Conditions: FC<ConditionsProps> = ({ setOpen, initialField }) => {
  const [selectedField, setSelectedField] = useState<Field | undefined>(
    initialField
  );
  const [selectNeighborsForId, setSelectNeighborsForId] = useState("");
  const [mixed, setMixed] = useState(false);

  useEffect(() => {
    if (selectedField) {
      controller.observe(selectedField.id, setSelectedField);
      return () =>
        controller.removeObserver(selectedField.id, setSelectedField);
    }
  }, [selectedField]);

  return (
    <div className={styles.grid}>
      <div id={styles.studentList}>
        <div className={selectNeighborsForId ? styles.selectNeighbors : ""}>
          {controller.getFields().map((field) => (
            <StudentTag
              key={field.id}
              initialField={field}
              setSelectedField={setSelectedField}
              selectNeighborsForId={selectNeighborsForId}
            />
          ))}
        </div>
      </div>
      <div id={styles.studentEditor}>
        {selectedField ? (
          <StudentEditor
            key={selectedField.id}
            field={selectedField}
            selectNeighborsForId={selectNeighborsForId}
            setSelectNeighborsForId={setSelectNeighborsForId}
          />
        ) : (
          <div className={styles.noStudent}>
            <p>
              Im Moment ist kein Schüler ausgewählt. <br />
              Bitte wähle einen Schüler aus der Liste oder füge neue Schüler
              hinzu.
            </p>
          </div>
        )}
      </div>
      <div id={styles.footer}>
        <button
          onClick={() => {
            controller.rearrangeStudentsByConstraints(mixed);
            setOpen(false);
          }}
        >
          Neu Anordnen
        </button>
        <div>
          <label htmlFor="mixed">Bunte Reihe</label>
          <CheckboxSwitch
            name="mixed"
            checked={mixed}
            onChange={() => setMixed((prevState) => !prevState)}
          />
        </div>
        <AddStudent />
      </div>
    </div>
  );
};
