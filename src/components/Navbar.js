import React from 'react';
import styles from './Navbar.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEdit, faSignOutAlt, faUsers } from '@fortawesome/free-solid-svg-icons';

function Navbar({ luthierName, onNavigateClients, onLogout, onEditProfile }) {
    return (
        <div className={styles.navbarWrapper}>
            <nav className={styles.navbar}>
                <div className={styles.logoSection}>
                    <img src="/resources/logo.png" alt="Luthin Logo" className={styles.logo} />
                </div>
                <div className={styles.menuLinks}>
                    <button className={styles.navButton} onClick={onNavigateClients}>
                        <FontAwesomeIcon icon={faUsers} className={styles.menuIcon} /> Clientes
                    </button>
                </div>
                <div className={styles.userMenu}>
                    <div className={styles.dropdown}>
                        <button className={styles.dropdownButton}>
                            <FontAwesomeIcon icon={faUser} className={styles.userIcon} /> {luthierName}
                        </button>
                        <div className={styles.dropdownContent}>
                            <button onClick={onEditProfile}>
                                <FontAwesomeIcon icon={faEdit} className={styles.dropdownIcon} /> Alterar Cadastro
                            </button>
                            <button onClick={onLogout}>
                                <FontAwesomeIcon icon={faSignOutAlt} className={styles.dropdownIcon} /> Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
            <div className={styles.gradientBar}></div>
        </div>
    );
}

export default Navbar;
