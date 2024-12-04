import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './ClientsPage.module.css';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faEdit, faTrash, faUser } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

function ClientsPage({ onAddClient, onEditClient, onViewClientProfile }) {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredClients, setFilteredClients] = useState([]);

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = () => {
        setLoading(true);
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
    };

    const handleAddClientClick = () => {
        onAddClient();
    };

    const handleEditClientClick = (clientId) => {
        onEditClient(clientId); // Navega para a página de edição do cliente
    };

    const handleViewClientProfileClick = (clientId) => {
        onViewClientProfile(clientId); // Navega para a página de perfil do cliente
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
                    .then(() => {
                        Swal.fire(
                            'Excluído!',
                            'O cliente foi excluído com sucesso.',
                            'success'
                        );
                        fetchClients(); // Atualiza a lista de clientes
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
                                            <div className={styles.actionsWrapper}>
                                                <button
                                                    onClick={() => handleViewClientProfileClick(client.idCLIENTE)}
                                                    className={styles.profileButton}
                                                >
                                                    <FontAwesomeIcon icon={faUser} />
                                                </button>
                                                <button
                                                    onClick={() => handleEditClientClick(client.idCLIENTE)}
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
                                            </div>
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
        </div>
    );
}

export default ClientsPage;
