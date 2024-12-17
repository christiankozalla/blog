import { FC, useState, Dispatch, SetStateAction } from "react";
import { AddStudent } from "./AddStudent";
import styles from "./Controls.module.css";

import AddStudentIcon from "../assets/person-add-outline.svg";
import ClassDocumentIcon from "../assets/document-text-outline.svg";
import SettingsIcon from "../assets/settings-outline.svg";
import SaveIcon from "../assets/save-outline.svg";

interface ControlsProps {
  handleModalOpen: Dispatch<SetStateAction<boolean>>;
}

export const Controls: FC<ControlsProps> = ({ handleModalOpen }) => {
  const [showAddStudentDialog, setShowAddStudentDialog] = useState(false);

  return (
    <div className={styles.controls}>
      {showAddStudentDialog && (
        <div className={styles.addStudent}>
          <AddStudent />
        </div>
      )}
      <div className={styles.tooltip} data-tooltip="Füge einen Schüler hinzu">
        <img
          src={AddStudentIcon}
          alt="Füge einen Schüler hinzu"
          className={styles.icon}
          onClick={() => setShowAddStudentDialog((prevShow) => !prevShow)}
        />
      </div>
      <div
        className={styles.tooltip}
        data-tooltip="Stelle konkrete Schüler-Sitzplan-Bedingungen auf!"
      >
        <img
          src={ClassDocumentIcon}
          alt="Sitzplan Info"
          className={styles.icon}
          onClick={() => handleModalOpen((prevOpen) => !prevOpen)}
        />
      </div>
      <div
        className={styles.tooltip}
        data-tooltip="Mehr Einstellungen für deinen Sitzplan...!"
      >
        <img src={SettingsIcon} alt="Einstellungen" className={styles.icon} />
      </div>
      <div
        className={styles.tooltip}
        data-tooltip="Speichere deinen Sitzplan als PDF!"
      >
        <img
          src={SaveIcon}
          alt="Speichere Sitzplan as PDF"
          className={styles.icon}
          onClick={() =>
            import("../lib/GeneratePDF")
              .then((module) => module.generatePdf())
              .catch((err) => console.error(err.message))
          }
        />
      </div>
    </div>
  );
};
