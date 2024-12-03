import React, { useState } from 'react';
import './App.css';
import Login from './components/Login';
import ClientsPage from './components/ClientsPage';
import ClientRegistration from './components/ClientRegistration';
import Navbar from './components/Navbar';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('luthierName'));
  const [currentPage, setCurrentPage] = useState(isLoggedIn ? 'home' : 'login');
  const [luthierName, setLuthierName] = useState(() => localStorage.getItem('luthierName') || '');

  const handleLoginSuccess = (name) => {
    localStorage.setItem('luthierName', name);
    setIsLoggedIn(true);
    setLuthierName(name);
    setCurrentPage('home');
    console.log("Login realizado, nome do luthier:", name);
  };

  const handleLogout = () => {
    localStorage.removeItem('luthierName');
    setIsLoggedIn(false);
    setLuthierName('');
    setCurrentPage('login');
  };

  const handleNavigate = (page) => {
    console.log("Navegando para a página:", page);
    setCurrentPage(page);
  };

  return (
    <div className="appContainer">
      {currentPage === 'login' && (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}
      {isLoggedIn && currentPage !== 'login' && (
        <>
          <Navbar
            luthierName={luthierName}
            onNavigateClients={() => handleNavigate('clients')}
            onLogout={handleLogout}
            onEditProfile={() => handleNavigate('editProfile')}
          />
          {currentPage === 'home' && (
            <div className="pageContent">
              <h2>Bem-vindo ao Luthin, {luthierName}!</h2>
              <p>Use a barra de navegação acima para acessar as funcionalidades do sistema.</p>
            </div>
          )}
          {currentPage === 'clients' && (
            <ClientsPage onAddClient={() => handleNavigate('registerClient')} />
          )}
          {currentPage === 'registerClient' && (
            <ClientRegistration onBackClick={() => handleNavigate('clients')} />
          )}
          {currentPage === 'editProfile' && (
            <div className="pageContent">
              <h2>Alterar Cadastro</h2>
              {/* Aqui você pode adicionar o formulário de edição de perfil */}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
