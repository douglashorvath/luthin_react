import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import styles from './ClientProfile.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

function ClientProfile({ clientId, onBackClick }) {
    const [clientData, setClientData] = useState({
        nome: '',
        cpf: '',
        email: '',
        data_nascimento: '',
        rg: '',
        sexo: '',
        profissao: '',
        rua: '',
        numero: '',
        bairro: '',
        cidade: '',
        estado: '',
        cep: '',
        telefones: []
    });

    const [instruments, setInstruments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchClientData();
        fetchClientInstruments();
    }, [clientId]);

    const fetchClientData = () => {
        setLoading(true);
        axios.get(`http://localhost:5000/api/clientes/${clientId}`)
            .then(response => {
                const data = response.data;

                // Corrigir formatação da data para dd/mm/aaaa
                if (data.data_nascimento) {
                    const dateObj = new Date(data.data_nascimento);
                    const day = String(dateObj.getDate()).padStart(2, '0');
                    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                    const year = dateObj.getFullYear();
                    data.data_nascimento = `${day}/${month}/${year}`;
                }

                setClientData(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Erro ao buscar perfil do cliente:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Erro',
                    text: 'Não foi possível carregar os dados do cliente.'
                });
                setLoading(false);
            });
    };

    const fetchClientInstruments = () => {
        axios.get(`http://localhost:5000/api/clientes/${clientId}/instrumentos`)
            .then(response => {
                setInstruments(response.data);
            })
            .catch(error => {
                console.error('Erro ao buscar instrumentos do cliente:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Erro',
                    text: 'Não foi possível carregar os instrumentos do cliente.'
                });
            });
    };

    return (
        <div className={styles.clientProfileContainer}>
            <h2 className={styles.header}>Perfil do Cliente</h2>
            {loading ? (
                <p className={styles.loadingMessage}>Carregando...</p>
            ) : (
                <>
                    {/* Seção de Dados Pessoais */}
                    <fieldset className={styles.fieldset}>
                        <legend>Dados Pessoais</legend>
                        <div className={styles.section}>
                            <div className={`${styles.formGroup} ${styles.nameField}`}>
                                <label>Nome</label>
                                <p className={styles.fieldValue}>{clientData.nome}</p>
                            </div>
                                <div className={`${styles.formGroup} ${styles.emailField}`}>
                                <label>Email</label>
                                <p className={styles.fieldValue}>{clientData.email}</p>
                            </div>
                            <div className={styles.formGroup}>
                                <label>CPF</label>
                                <p className={styles.fieldValue}>{clientData.cpf}</p>
                            </div>
                            <div className={styles.formGroup}>
                                <label>RG</label>
                                <p className={styles.fieldValue}>{clientData.rg}</p>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Sexo</label>
                                <p className={styles.fieldValue}>{clientData.sexo}</p>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Data de Nascimento</label>
                                <p className={styles.fieldValue}>{clientData.data_nascimento}</p>
                            </div>
                                <div className={`${styles.formGroup} ${styles.emailField}`}>
                                <label>Profissão</label>
                                <p className={styles.fieldValue}>{clientData.profissao}</p>
                            </div>
                            <div className={`${styles.formGroup} ${styles.addressField}`}>
                                <label>Endereço</label>
                                <p className={styles.fieldValue}>
                                    {`${clientData.rua}, ${clientData.numero}, ${clientData.bairro}, ${clientData.cidade} - ${clientData.estado}, ${clientData.cep}`}
                                </p>
                            </div>

                        </div>
                    </fieldset>

                    {/* Seção de Telefones */}
                    <fieldset className={styles.fieldset}>
                        <legend>Telefones</legend>
                        <div className={styles.section}>
                            {clientData.telefones.length > 0 ? (
                                clientData.telefones.map((telefone, index) => (
                                    <div key={index} className={styles.phoneGroup}>
                                        <p className={styles.fieldValue}>
                                            {telefone}
                                            <a
                                                href={`https://wa.me/${telefone.replace(/\D/g, '')}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={styles.whatsappIconLink}
                                            >
                                                <FontAwesomeIcon icon={faWhatsapp} className={styles.whatsappIcon} />
                                            </a>
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className={styles.fieldValue}>Nenhum telefone cadastrado</p>
                            )}
                        </div>
                    </fieldset>

                    {/* Seção de Instrumentos do Cliente */}
                    <fieldset className={styles.fieldset}>
                        <legend>Instrumentos do Cliente</legend>
                        <div className={styles.instrumentsSection}>
                            {instruments.length === 0 ? (
                                <p className={styles.noInstrumentsMessage}>Nenhum instrumento cadastrado para este cliente.</p>
                            ) : (
                                instruments.map((instrument) => (
                                    <div key={instrument.idINSTRUMENTO} className={styles.instrumentCard}>
                                        <h3 className={styles.instrumentTitle}>{instrument.modelo}</h3>
                                        <p><strong>Serial:</strong> {instrument.serial}</p>
                                        <p><strong>Cordas:</strong> {instrument.cordas}</p>
                                        <p><strong>Condição:</strong> {instrument.condicao}</p>
                                        <p><strong>Origem:</strong> {instrument.origem}</p>
                                        <p><strong>Marca:</strong> {instrument.marcaNome}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </fieldset>

                    {/* Botão Voltar */}
                    <div className={styles.formActions}>
                        <button
                            type="button"
                            className={styles.backButton}
                            onClick={onBackClick}
                        >
                            Voltar
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default ClientProfile;
