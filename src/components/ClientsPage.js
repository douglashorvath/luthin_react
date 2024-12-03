import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './ClientsPage.module.css';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import EditClient from './EditClient'; // Importa o componente de edição de cliente

function ClientsPage({ onAddClient }) {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredClients, setFilteredClients] = useState([]);
    const [currentPage, setCurrentPage] = useState('list');
    const [selectedClientId, setSelectedClientId] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:5000/api/clientes')
            .then(response => {
                const clientsData = response.data.slice(-20); // Pega os últimos 20 clientes cadastrados
                setClients(clientsData);
                setFilteredClients(clientsData);
                setLoading(false);
            })
            .catch(error => {
                console.error('Erro ao buscar clientes:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Erro',
                    text: 'Não foi possível carregar a lista de clientes.'
                });
                setLoading(false);
            });
    }, []);

    const handleAddClientClick = () => {
        onAddClient();
    };

    const handleEditClient = (clientId) => {
        setSelectedClientId(clientId);
        setCurrentPage('edit');
    };

    const handleDeleteClient = (clientId) => {
        Swal.fire({
            title: 'Tem certeza?',
            text: 'Você não poderá desfazer essa ação!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sim, excluir!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`http://localhost:5000/api/clientes/${clientId}`)
                    .then(response => {
                        Swal.fire(
                            'Excluído!',
                            'O cliente foi excluído com sucesso.',
                            'success'
                        );
                        setClients(prevClients => prevClients.filter(client => client.idCLIENTE !== clientId));
                        setFilteredClients(prevClients => prevClients.filter(client => client.idCLIENTE !== clientId));
                    })
                    .catch(error => {
                        console.error('Erro ao excluir cliente:', error);
                        Swal.fire({
                            icon: 'error',
                            title: 'Erro',
                            text: 'Não foi possível excluir o cliente. Tente novamente mais tarde.'
                        });
                    });
            }
        });
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        setFilteredClients(clients.filter(client =>
            client.nome.toLowerCase().includes(value.toLowerCase()) || client.cpf.includes(value)
        ));
    };

    return (
        <div className={styles.clientsContainer}>
            {currentPage === 'list' && (
                <>
                    <div className={styles.header}>
                        <h2 className={styles.title}>Clientes</h2>
                        <input
                            type="text"
                            placeholder="Buscar por nome ou CPF..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className={styles.searchInput}
                        />
                    </div>
                    {loading ? (
                        <p className={styles.loadingMessage}>Carregando...</p>
                    ) : (
                        <>
                            {filteredClients.length === 0 ? (
                                <p className={styles.noClients}>Nenhum cliente encontrado.</p>
                            ) : (
                                <table className={styles.clientsTable}>
                                    <thead>
                                        <tr>
                                            <th>Nome</th>
                                            <th>Email</th>
                                            <th>CPF</th>
                                            <th>Cidade</th>
                                            <th>Telefones</th>
                                            <th>Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredClients.map(client => (
                                            <tr key={client.idCLIENTE}>
                                                <td>{client.nome}</td>
                                                <td>{client.email}</td>
                                                <td>{client.cpf}</td>
                                                <td>{client.cidade}</td>
                                                <td>
                                                    {client.telefones.split(', ').map((telefone, index) => (
                                                        <div key={index} className={styles.phoneWithIcon}>
                                                            {telefone}
                                                            <a href={`https://wa.me/${telefone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                                                                <FontAwesomeIcon icon={faWhatsapp} className={styles.whatsappIcon} />
                                                            </a>
                                                        </div>
                                                    ))}
                                                </td>
                                                <td className={styles.actionButtons}>
                                                    <button
                                                        onClick={() => handleEditClient(client.idCLIENTE)}
                                                        className={styles.editButton}
                                                    >
                                                        <FontAwesomeIcon icon={faEdit} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteClient(client.idCLIENTE)}
                                                        className={styles.deleteButton}
                                                    >
                                                        <FontAwesomeIcon icon={faTrash} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                            <div className={styles.addButtonContainer}>
                                <button className={styles.newClientButton} onClick={handleAddClientClick}>
                                    <FontAwesomeIcon icon={faUserPlus} className={styles.buttonIcon} /> Novo Cliente
                                </button>
                            </div>
                        </>
                    )}
                </>
            )}

            {currentPage === 'edit' && (
                <EditClient clientId={selectedClientId} onBackClick={() => setCurrentPage('list')} />
            )}
        </div>
    );
}

export default ClientsPage;
