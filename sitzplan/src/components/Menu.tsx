import { FC, useState, useEffect } from "react";
import { controller } from "../App";
import styles from "./Menu.module.css";

export const Menu: FC = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [roomName, setRoomName] = useState(controller.getRoomName());
  const [classGroupName, setClassGroupName] = useState(
    controller.getClassName()
  );
  const [rows, setRows] = useState(controller.getDimension("rows").toString());
  const [cols, setCols] = useState(controller.getDimension("cols").toString());

  useEffect(() => controller.observe("roomName", setRoomName), []);
  useEffect(() => controller.observe("className", setClassGroupName), []);
  useEffect(() => {
    controller.observe("rows", setRows);
    controller.observe("columns", setCols);
    document.documentElement.style.setProperty("--rows", `${rows}`);
    document.documentElement.style.setProperty("--columns", `${cols}`);
  }, [rows, cols]);

  return (
    <div className={styles.menu}>
      <div className={styles.firstLine}>
        <button
          className={styles.menuButton}
          aria-label="Menü"
          onClick={() => setShowMenu((prevShow) => !prevShow)}
        ></button>
        <label htmlFor="roomName" className="screenReaderOnly">
          Name des Klassenraums
        </label>
        <input
          id="roomName"
          className={styles.input}
          value={roomName}
          placeholder="Raum"
          type="text"
          onChange={(e) =>
            controller.updateMetaData("roomName", e.target.value)
          }
        />
        <label htmlFor="className" className="screenReaderOnly">
          Name der Klasse
        </label>
        <input
          id="className"
          className={styles.input}
          value={classGroupName}
          placeholder="Klasse"
          type="text"
          onChange={(e) =>
            controller.updateMetaData("className", e.target.value)
          }
        />
      </div>
      {showMenu && (
        <div className={styles.expandedMenu}>
          <ul role="list">
            <li>
              <label htmlFor="rows">Anzahl der Reihen</label>{" "}
              <select
                name="rows"
                id="rows"
                value={rows}
                onChange={(e) =>
                  controller.updateMetaData("rows", e.target.value)
                }
              >
                <option value="9">9</option>
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
              </select>
            </li>
            <li>
              <label htmlFor="cols">Anzahl der Spalten</label>{" "}
              <select
                name="cols"
                id="cols"
                value={cols}
                onChange={(e) =>
                  controller.updateMetaData("columns", e.target.value)
                }
              >
                <option value="9">9</option>
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
              </select>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
