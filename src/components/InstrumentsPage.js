import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './InstrumentsPage.module.css';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

function InstrumentsPage({ onAddInstrument, onEditInstrument }) {
    const [instruments, setInstruments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredInstruments, setFilteredInstruments] = useState([]);

    useEffect(() => {
        fetchInstruments();
    }, []);

    const fetchInstruments = () => {
        setLoading(true);
        axios.get('http://localhost:5000/api/instrumentos')
            .then(response => {
                const instrumentsData = response.data.slice(-20); // Pega os últimos 20 instrumentos cadastrados
                setInstruments(instrumentsData);
                setFilteredInstruments(instrumentsData);
                setLoading(false);
            })
            .catch(error => {
                console.error('Erro ao buscar instrumentos:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Erro',
                    text: 'Não foi possível carregar a lista de instrumentos.'
                });
                setLoading(false);
            });
    };

    const handleAddInstrumentClick = () => {
        onAddInstrument();
    };

    const handleEditInstrumentClick = (instrumentId) => {
        onEditInstrument(instrumentId); // Navega para a página de edição do instrumento
    };


    const handleDeleteInstrument = (instrumentId) => {
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
                axios.delete(`http://localhost:5000/api/instrumentos/${instrumentId}`)
                    .then(() => {
                        Swal.fire(
                            'Excluído!',
                            'O instrumento foi excluído com sucesso.',
                            'success'
                        );
                        fetchInstruments(); // Atualiza a lista de instrumentos
                    })
                    .catch(error => {
                        console.error('Erro ao excluir instrumento:', error);
                        Swal.fire({
                            icon: 'error',
                            title: 'Erro',
                            text: 'Não foi possível excluir o instrumento. Tente novamente mais tarde.'
                        });
                    });
            }
        });
    };

    const handleSearchChange = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchTerm(value);
        setFilteredInstruments(instruments.filter(instrument =>
            instrument.modelo.toLowerCase().includes(value) ||
            (instrument.serial && instrument.serial.toLowerCase().includes(value)) ||
            instrument.clienteNome.toLowerCase().includes(value)
        ));
    };

    return (
        <div className={styles.instrumentsContainer}>
            <div className={styles.header}>
                <h2 className={styles.title}>Instrumentos</h2>
                <input
                    type="text"
                    placeholder="Buscar por modelo, serial ou cliente..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className={styles.searchInput}
                />
            </div>
            {loading ? (
                <p className={styles.loadingMessage}>Carregando...</p>
            ) : (
                <>
                    {filteredInstruments.length === 0 ? (
                        <p className={styles.noInstruments}>Nenhum instrumento encontrado.</p>
                    ) : (
                        <table className={styles.instrumentsTable}>
                            <thead>
                                <tr>
                                    <th>Modelo</th>
                                    <th>Serial</th>
                                    <th>Condição</th>
                                    <th>Marca</th>
                                    <th>Cliente</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredInstruments.map(instrument => (
                                    <tr key={instrument.idINSTRUMENTO}>
                                        <td>{instrument.modelo}</td>
                                        <td>{instrument.serial || '-'}</td>
                                        <td>{instrument.condicao || '-'}</td>
                                        <td>{instrument.marcaNome || '-'}</td>
                                        <td>{instrument.clienteNome || '-'}</td>
                                        <td className={styles.actionButtons}>
                                            <div className={styles.actionsWrapper}>
                                                <button
                                                    onClick={() => handleEditInstrumentClick(instrument.idINSTRUMENTO)}
                                                    className={styles.editButton}
                                                >
                                                    <FontAwesomeIcon icon={faEdit} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteInstrument(instrument.idINSTRUMENTO)}
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
                        <button className={styles.newInstrumentButton} onClick={handleAddInstrumentClick}>
                            <FontAwesomeIcon icon={faPlus} className={styles.buttonIcon} /> Novo Instrumento
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default InstrumentsPage;
