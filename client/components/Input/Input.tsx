import React, { ChangeEventHandler, ReactElement } from "react";

import cn from "classnames";

import styles from "./Input.module.scss";




interface Props {
  name: string;
  id: string;
  label?: string;
  type?: string;
  value?: string | number;
  placeholder?: string;
  fullWidth?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}

function Input({
  name,
  id,
  type,
  value,
  label,
  placeholder,
  fullWidth = false,
  onChange
}: Props): ReactElement {
  return (
    <span className={styles.wrapper}>
      {label && (
        <label className={styles.label} htmlFor={id}>
          {label}
        </label>
      )}
      <input
        className={cn(styles.input, {
          [styles.inputFullWidth]: fullWidth
        })}
        placeholder={placeholder}
        name={name}
        id={id}
        type={type}
        value={value}
        onChange={onChange}
      />
    </span>
  );
}

export default Input;
