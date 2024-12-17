import { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { TouchBackend } from "react-dnd-touch-backend";
import { Classroom } from "./components/Classroom";
import { Controls } from "./components/Controls";
import { Menu } from "./components/Menu";
import { Modal } from "./components/Modal";
import { RecycleBin } from "./components/RecycleBin";
import { Conditions } from "./components/Conditions";
import { Controller } from "./lib/Controller";
import { getInitialDataFromUrl } from "./lib/Utils";
import { ModalConfig } from "./lib/Model";
import styles from "./App.module.css";

// Disable Contextmenu on right-click globally - only in prod
// because right-click on a Student opens a Modal with StudentEditor
import.meta.env.PROD &&
  window.addEventListener("contextmenu", (e) => e.preventDefault());

export const controller: Controller = getInitialDataFromUrl();

window.addEventListener("popstate", (e) => {
  controller.init({ ...e.state });
  controller.updateClassroom();
});

export default function App() {
  const [modal, setModal] = useState<ModalConfig>({
    isOpen: false,
    title: "",
    field: undefined,
  });
  const [classroomKey, setClassroomKey] = useState(
    controller.getClassroomKey()
  );

  useEffect(() => {
    controller.observeClassroomKey(setClassroomKey);
    controller.observe("appModal", setModal);

    return () => controller.removeObserver("appModal", setModal);
  }, [classroomKey]);

  const handleModalOpen = (
    isOpen: boolean | ((prevOpen: boolean) => boolean)
  ) => {
    if (typeof isOpen === "boolean") {
      return setModal({
        isOpen,
        title: "Editor isOpen === boolean",
      });
    } else if (typeof isOpen === "function") {
      const newOpen = isOpen(modal.isOpen);
      setModal({
        isOpen: newOpen,
        title: "Student Editor",
        field: newOpen === true ? modal.field : undefined,
      });
    }
  };

  return (
    <>
      <Menu key={classroomKey} />
      <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }}>
        <div className={styles.layout}>
          <Controls handleModalOpen={handleModalOpen} />
          <Classroom key={classroomKey} />
        </div>
        <RecycleBin />
      </DndProvider>
      <Modal
        isOpen={modal.isOpen}
        setOpen={handleModalOpen}
        title={modal.title}
      >
        {modal.component || (
          <Conditions setOpen={handleModalOpen} initialField={modal.field} />
        )}
      </Modal>
    </>
  );
}
