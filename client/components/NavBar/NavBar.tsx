import React, { ReactElement } from "react";
import styles from "./NavBar.module.scss";
import logoLight from "../../assets/logo-light.png";

function NavBar(): ReactElement {
  return (
    <nav className={styles.nav}>
      <div className={styles.branding}>
        <img className={styles.brandImage} src={logoLight} alt="Indeps" />
        <span className={styles.brandVersion}>v0.6.0</span>
      </div>
      <div className={styles.name}>
        <h5>project-name!</h5>
      </div>
    </nav>
  );
}

export default NavBar;
