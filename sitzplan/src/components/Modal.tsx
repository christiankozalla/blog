import type { Dispatch, FC, SetStateAction, PropsWithChildren } from "react";
import styles from "./Modal.module.css";

interface ModalProps {
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  title: string;
}

export const Modal: FC<PropsWithChildren<ModalProps>> = ({ isOpen, setOpen, title, children }) => {
  if (isOpen) {
    return (
      <>
        <div role="dialog" className={styles.dialog}>
          <div className={styles.headline}>
            <h2>{title}</h2>
            <button
              type="button"
              className={styles.closeModal}
              onClick={() => setOpen(false)}
            >
              &times;
            </button>
          </div>
          <div className={styles.content}>{children}</div>
        </div>
        <div className={styles.backdrop}></div>
      </>
    );
  } else {
    return null;
  }
};
