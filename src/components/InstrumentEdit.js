import React, { useState, useEffect } from 'react';
import AsyncSelect from 'react-select/async';
import styles from './InstrumentRegistration.module.css';
import Swal from 'sweetalert2';
import axios from 'axios';

function InstrumentEdit({ instrumentId, onBackClick }) {
    const [instrumentData, setInstrumentData] = useState({
        modelo: '',
        serial: '',
        origem: '',
        cordas: '',
        condicao: '',
        descritivo: '',
        idCLIENTE: '',
        clienteNome: '',
        idMARCA: ''
    });

    const [marcas, setMarcas] = useState([]);

    useEffect(() => {
        // Fetch marcas para autocomplete
        axios.get('http://localhost:5000/api/marcas')
            .then(response => setMarcas(response.data))
            .catch(error => Swal.fire('Erro', 'Erro ao buscar marcas.', 'error'));

        // Fetch instrument data for editing
        axios.get(`http://localhost:5000/api/instrumentos/${instrumentId}`)
            .then(response => {
                const { idCLIENTE, clienteNome, ...rest } = response.data;
                setInstrumentData({
                    ...rest,
                    idCLIENTE,
                    clienteNome
                });
            })
            .catch(error => Swal.fire('Erro', 'Erro ao buscar os dados do instrumento.', 'error'));
    }, [instrumentId]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Para o campo 'Cordas', garantir que seja numérico entre 2 e 30
        if (name === 'cordas' && (isNaN(value) || value < 2 || value > 30)) {
            return; // Ignorar valores fora do intervalo ou não numéricos
        }

        setInstrumentData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleClientChange = (selectedOption) => {
        setInstrumentData((prev) => ({
            ...prev,
            idCLIENTE: selectedOption ? selectedOption.value : '',
            clienteNome: selectedOption ? selectedOption.label : ''
        }));
    };

    const loadClientes = async (inputValue) => {
        if (!inputValue) return [];
        try {
            const response = await axios.get(`http://localhost:5000/api/clientes`);
            return response.data
                .filter(cliente => cliente.nome.toLowerCase().includes(inputValue.toLowerCase()))
                .slice(0, 20) // Limitar a 20 clientes
                .map(cliente => ({
                    value: cliente.idCLIENTE,
                    label: cliente.nome
                }));
        } catch (error) {
            Swal.fire('Erro', 'Erro ao buscar clientes.', 'error');
            return [];
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validação dos campos obrigatórios
        if (!instrumentData.modelo || !instrumentData.idCLIENTE || !instrumentData.idMARCA) {
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'Por favor, preencha todos os campos obrigatórios.'
            });
            return;
        }

        axios.put(`http://localhost:5000/api/instrumentos/${instrumentId}`, instrumentData)
            .then(() => {
                Swal.fire({
                    icon: 'success',
                    title: 'Instrumento atualizado com sucesso!',
                    confirmButtonText: 'OK'
                }).then(() => {
                    onBackClick(); // Volta para a página de listagem de instrumentos
                });
            })
            .catch(error => {
                console.error('Erro ao atualizar instrumento:', error);
                let errorMessage = 'Erro ao atualizar o instrumento. Tente novamente mais tarde.';
                if (error.response && error.response.data) {
                    errorMessage = error.response.data;
                }
                Swal.fire({
                    icon: 'error',
                    title: 'Erro',
                    text: errorMessage
                });
            });
    };

    const customStyles = {
        control: (provided) => ({
            ...provided,
            backgroundColor: '#333',
            borderColor: '#ffcc00',
            color: '#fff',
            borderRadius: '5px',
            padding: '5px',
        }),
        menu: (provided) => ({
            ...provided,
            backgroundColor: '#1e1e1e',
            color: '#fff',
            zIndex: 5,
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isFocused ? '#ffcc00' : '#1e1e1e',
            color: state.isFocused ? '#000' : '#fff',
            cursor: 'pointer',
        }),
        singleValue: (provided) => ({
            ...provided,
            color: '#fff',
        }),
        placeholder: (provided) => ({
            ...provided,
            color: '#bfbfbf',
        }),
        input: (provided) => ({
            ...provided,
            color: '#fff',
        }),
    };

    return (
        <div className={styles.instrumentRegistrationContainer}>
            <h2 className={styles.header}>Edição de Instrumento</h2>
            <form onSubmit={handleSubmit} className={styles.instrumentForm}>
                {/* Seção de Dados do Instrumento */}
                <fieldset className={styles.fieldset}>
                    <legend>Dados do Instrumento</legend>
                    <div className={styles.section}>
                        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                            <label>Modelo*</label>
                            <input type="text" name="modelo" value={instrumentData.modelo} onChange={handleChange} required />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Serial</label>
                            <input type="text" name="serial" value={instrumentData.serial} onChange={handleChange} />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Origem</label>
                            <input type="text" name="origem" value={instrumentData.origem} onChange={handleChange} />
                        </div>
                        <div className={`${styles.formGroup} ${styles.smallWidth}`}>
                            <label>Cordas*</label>
                            <input type="number" name="cordas" value={instrumentData.cordas} onChange={handleChange} min="2" max="30" required />
                        </div>
                        <div className={`${styles.formGroup} ${styles.widerField}`}>
                            <label>Condição</label>
                            <textarea name="condicao" value={instrumentData.condicao} onChange={handleChange}></textarea>
                        </div>
                        <div className={`${styles.formGroup} ${styles.widerField}`}>
                            <label>Descritivo</label>
                            <textarea name="descritivo" value={instrumentData.descritivo} onChange={handleChange}></textarea>
                        </div>
                    </div>
                </fieldset>

                {/* Seção de Cliente */}
                <fieldset className={styles.fieldset}>
                    <legend>Cliente</legend>
                    <div className={styles.section}>
                        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                            <label>Cliente*</label>
                            <AsyncSelect
                                cacheOptions
                                loadOptions={loadClientes}
                                onChange={handleClientChange}
                                placeholder="Digite para buscar o cliente"
                                defaultOptions={[]}
                                value={instrumentData.idCLIENTE ? { value: instrumentData.idCLIENTE, label: instrumentData.clienteNome } : null}
                                styles={customStyles}
                            />
                        </div>
                    </div>
                </fieldset>

                {/* Seção de Marca */}
                <fieldset className={styles.fieldset}>
                    <legend>Marca</legend>
                    <div className={styles.section}>
                        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                            <label>Marca*</label>
                            <select
                                name="idMARCA"
                                value={instrumentData.idMARCA}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Selecione a Marca</option>
                                {marcas.map(marca => (
                                    <option key={marca.idMARCA} value={marca.idMARCA}>
                                        {marca.nome}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </fieldset>

                {/* Ações do Formulário */}
                <div className={styles.formActions}>
                    <button type="submit" className={styles.submitButton}>Salvar Alterações</button>
                    <button type="button" className={styles.backButton} onClick={onBackClick}>Voltar</button>
                </div>
            </form>
        </div>
    );
}

export default InstrumentEdit;
