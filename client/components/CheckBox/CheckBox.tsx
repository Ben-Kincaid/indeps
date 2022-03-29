import React, { ChangeEventHandler, ReactElement } from "react";

import classNames from "classnames";

import styles from "./CheckBox.module.scss";

interface Props {
  id: string;
  name: string;
  checked?: boolean;
  children?: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}

function CheckBox({
  id,
  name,
  checked,
  children,
  onChange
}: Props): ReactElement {
  return (
    <div className={styles.wrapper}>
      <span
        className={classNames(styles.inputWrapper, {
          [styles.inputWrapperChecked]: checked
        })}
      >
        <input
          className={styles.input}
          id={id}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={onChange}
        />
      </span>
      {children && (
        <label className={styles.inputLabel} htmlFor={id}>
          {children}
        </label>
      )}
    </div>
  );
}

export default CheckBox;
