import React, { ChangeEventHandler, ReactElement, useState } from "react";

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
  autoComplete?: string;
}

interface InputProps extends Props {
  startAdornment?: React.FunctionComponent<Partial<Props>>;
}

function Input({
  name,
  id,
  type,
  value,
  label,
  placeholder,
  fullWidth = false,
  onChange,
  autoComplete,
  startAdornment: StartAdornment
}: InputProps): ReactElement {
  const [focused, setFocused] = useState(false);

  const handleFocus = () => {
    setFocused(true);
  };

  const handleBlur = () => {
    setFocused(false);
  };

  return (
    <div
      className={cn(styles.container, {
        [styles.containerFocused]: focused
      })}
    >
      {label && (
        <label className={styles.label} htmlFor={id}>
          {label}
        </label>
      )}
      <span className={styles.inputWrapper}>
        {StartAdornment && (
          <div className={styles.inputStartAdornment}>
            <StartAdornment />
          </div>
        )}
        <input
          className={cn(styles.input, {
            [styles.inputFullWidth]: fullWidth
          })}
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoComplete={autoComplete}
          placeholder={placeholder}
          name={name}
          id={id}
          type={type}
          value={value}
          onChange={onChange}
        />
      </span>
    </div>
  );
}

export default Input;
