import React, { ReactElement } from "react";

import { NavLink } from "react-router-dom";

import logoLight from "client/assets/logo-light.png";
import useData from "client/hooks/useData";

import styles from "./NavBar.module.scss";

function NavBar(): ReactElement {
  const { version, packageName } = useData();

  return (
    <div className={styles.nav}>
      <nav className={styles.mainNav} aria-label="primary">
        <div className={styles.branding}>
          <img
            className={styles.brandImage}
            src={logoLight}
            alt="Indeps"
          />
          <span className={styles.brandVersion}>{version}</span>
        </div>
        {packageName && (
          <div className={styles.name}>
            <h6>{packageName}</h6>
          </div>
        )}
      </nav>
      <nav className={styles.subNav}>
        <ul className={styles.subNavList}>
          <li className={styles.subNavListItem}>
            <NavLink
              className={styles.subNavListItemLink}
              activeClassName={styles.subNavListItemLinkActive}
              to="/list"
            >
              Dependency List
            </NavLink>
          </li>
          <li className={styles.subNavListItem}>
            <NavLink
              className={styles.subNavListItemLink}
              activeClassName={styles.subNavListItemLinkActive}
              to="/graph"
            >
              Dependency Graph
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default NavBar;
