import { FC } from "react";
import styles from "./TouchWarning.module.css";

export const TouchWarning: FC = () => {
  return (
    <div className={styles.touchWarning}>
      <p>
        Seaty unterstützt leider (noch) keine Touch-Events zum Drag
        &apos;n&apos; Drop der Tische und Schüler. Die Library, die das Drag
        &apos;n&apos; Drop Feature für Seaty bereitstellt, bietet auch ein
        Touch-Backend an, das diese Funktionalität mitbringt. Es ist jedoch noch
        nicht implementiert.
      </p>
      <p>
        Darüber hinaus bieten kleine Bildschirme kaum Platz, um komplexe
        Sitzpläne zu gestalten.
      </p>
      <p className={styles.hint}>
        Bitte auf PC, Mac oder Linux verwenden verwenden!
      </p>
    </div>
  );
};
