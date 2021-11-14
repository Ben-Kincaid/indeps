import React, { ReactElement } from "react";
import styles from "./NavBar.module.scss";

function NavBar(): ReactElement {
  return (
    <nav className={styles.nav}>
      <div className={styles.branding}>
        <h4 className={styles.brandingHeader}>Indeps</h4>
      </div>
      <div className={styles.navigation}></div>
    </nav>
  );
}

export default NavBar;
