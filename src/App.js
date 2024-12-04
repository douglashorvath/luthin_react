import React, { useState } from 'react';
import './App.css';
import Login from './components/Login';
import ClientsPage from './components/ClientsPage';
import ClientRegistration from './components/ClientRegistration';
import EditClient from './components/EditClient';
import ClientProfile from './components/ClientProfile';
import Navbar from './components/Navbar';
import InstrumentsPage from './components/InstrumentsPage';
import InstrumentRegistration from './components/InstrumentRegistration';
import InstrumentEdit from './components/InstrumentEdit';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('luthierName'));
  const [currentPage, setCurrentPage] = useState(isLoggedIn ? 'home' : 'login');
  const [luthierName, setLuthierName] = useState(() => localStorage.getItem('luthierName') || '');
  const [editingClientId, setEditingClientId] = useState(null);
  const [editingInstrumentId, setEditingInstrumentId] = useState(null);
  const [viewingClientId, setViewingClientId] = useState(null);

  const handleLoginSuccess = (name) => {
    localStorage.setItem('luthierName', name);
    setIsLoggedIn(true);
    setLuthierName(name);
    setCurrentPage('home');
  };

  const handleLogout = () => {
    localStorage.removeItem('luthierName');
    setIsLoggedIn(false);
    setLuthierName('');
    setCurrentPage('login');
  };

  const handleNavigate = (page, id = null) => {
    if (page === 'editClient' && id) {
      setEditingClientId(id);
    }
    if (page === 'editInstrument' && id) {
      setEditingInstrumentId(id);
    }
    if (page === 'viewClientProfile' && id) {
      setViewingClientId(id);
    }
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
            onNavigateInstruments={() => handleNavigate('instruments')}
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
            <ClientsPage
              onAddClient={() => handleNavigate('registerClient')}
              onEditClient={(clientId) => handleNavigate('editClient', clientId)}
              onViewClientProfile={(clientId) => handleNavigate('viewClientProfile', clientId)}
            />
          )}
          {currentPage === 'registerClient' && (
            <ClientRegistration onBackClick={() => handleNavigate('clients')} />
          )}
          {currentPage === 'editClient' && editingClientId && (
            <EditClient clientId={editingClientId} onBackClick={() => handleNavigate('clients')} />
          )}
          {currentPage === 'viewClientProfile' && viewingClientId && (
            <ClientProfile clientId={viewingClientId} onBackClick={() => handleNavigate('clients')} />
          )}
          {currentPage === 'instruments' && (
            <InstrumentsPage
              onAddInstrument={() => handleNavigate('registerInstrument')}
              onEditInstrument={(instrumentId) => handleNavigate('editInstrument', instrumentId)}
            />
          )}
          {currentPage === 'registerInstrument' && (
            <InstrumentRegistration onBackClick={() => handleNavigate('instruments')} />
          )}
          {currentPage === 'editInstrument' && editingInstrumentId && (
            <InstrumentEdit
              instrumentId={editingInstrumentId}
              onBackClick={() => handleNavigate('instruments')}
            />
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
