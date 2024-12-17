import { FC, useEffect } from "react";
import { Square } from "./Square";
import { controller } from "../App";
import styles from "./Classroom.module.css";

export const Classroom: FC = () => {
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--columns",
      `${controller.getDimension("cols")}`
    );
    document.documentElement.style.setProperty(
      "--rows",
      `${controller.getDimension("rows")}`
    );
  });

  return (
    <div className={styles.board}>
      {controller.getFields().map((field) => {
        return (
          <div key={field.id} className={styles.square}>
            <Square initialField={field} />
          </div>
        );
      })}
    </div>
  );
};
