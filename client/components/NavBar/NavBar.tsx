import React, { ReactElement } from "react";
import styles from "./NavBar.module.scss";
import logoLight from "../../assets/logo-light.png";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";

function NavBar(): ReactElement {
  return (
    <div className={styles.nav}>
      <nav className={styles.mainNav} aria-label="primary">
        <div className={styles.branding}>
          <img className={styles.brandImage} src={logoLight} alt="Indeps" />
          <span className={styles.brandVersion}>v0.6.0</span>
        </div>
        <div className={styles.name}>
          <h6>project-name!</h6>
        </div>
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
              to="/tree"
            >
              Tree View
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default NavBar;
