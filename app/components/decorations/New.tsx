import type React from "react";
import styles from "./New.module.scss";

export const NewDecoration: React.FC = () => {
  return (
    <span
      className={`${styles.blink} text-shadow-red-500 text-red-600 font-bold`}
    >
      New!
    </span>
  );
};
