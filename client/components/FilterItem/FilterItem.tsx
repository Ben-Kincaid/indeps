import React, { ReactElement } from "react";

import classNames from "classnames";

import CheckBox from "client/components/CheckBox";

import styles from "./FilterItem.module.scss";

type FilterClickHandler = (value: string) => void;

interface Props {
  value: string;
  active?: boolean;
  label?: string;
  className?: string;
  onClick?: FilterClickHandler;
}

function FilterItem({
  value,
  active,
  label,
  className,
  onClick
}: Props): ReactElement {
  const handleOnChange = () => {
    if (onClick) onClick(value);
  };

  return (
    <li className={classNames(styles.item, className)}>
      <CheckBox
        id={value}
        name={value}
        checked={active}
        onChange={handleOnChange}
      >
        {label}
      </CheckBox>
    </li>
  );
}

export default FilterItem;
