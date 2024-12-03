import React, { useState } from 'react'; // Adicionei useState à importação
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUsers } from '@fortawesome/free-solid-svg-icons';
import './HomePage.css'; // Importando o CSS da página inicial
import logo from '../resources/logo.png'; // Caminho atualizado para o logo
import ClientsPage from './ClientsPage'; // Importar o componente da página de clientes

function HomePage({ luthierName, onLogout }) {
    const [showClientsPage, setShowClientsPage] = useState(false);

    return (
        <div className="homepage-container">
            <nav className="navbar">
                <div className="navbar-left">
                    <div className="navbar-logo">
                        <img src={logo} alt="Logo do Sistema" className="logo" />
                    </div>
                    <div className="menu-item" onClick={() => setShowClientsPage(false)}>
                        <FontAwesomeIcon icon={faUsers} /> Home
                    </div>
                    <div className="menu-item" onClick={() => setShowClientsPage(true)}>
                        <FontAwesomeIcon icon={faUsers} /> Clientes
                    </div>
                </div>
                <div className="navbar-right">
                    <div className="dropdown">
                        <button className="dropdown-button">
                            <FontAwesomeIcon icon={faUser} className="user-icon" />
                            {luthierName}
                        </button>
                        <div className="dropdown-content">
                            <a href="#" onClick={() => alert('Função de alterar cadastro em breve')}>Alterar Cadastro</a>
                            <a href="#" onClick={onLogout}>Logout</a>
                        </div>
                    </div>
                </div>
            </nav>
            <div className="homepage-content">
                {showClientsPage ? (
                    <ClientsPage />
                ) : (
                    <>
                        <h1>Bem-vindo ao sistema Luthin!</h1>
                        <p>Selecione uma opção no menu para começar.</p>
                    </>
                )}
            </div>
        </div>
    );
}

export default HomePage;
