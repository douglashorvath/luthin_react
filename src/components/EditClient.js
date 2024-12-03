// EditClient.js
import React, { useState, useEffect } from 'react';
import styles from './EditClient.module.css';
import Swal from 'sweetalert2';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

function EditClient({ clientId, onBackClick }) {
    const [clientData, setClientData] = useState({
        nome: '',
        cpf: '',
        data_nascimento: '',
        rg: '',
        sexo: '',
        profissao: '',
        email: '',
        cep: '',
        rua: '',
        numero: '',
        bairro: '',
        cidade: '',
        estado: '',
    });
    const [telefones, setTelefones] = useState(['']);

    useEffect(() => {
        // Busca os dados do cliente a ser editado
        axios.get(`http://localhost:5000/api/clientes/${clientId}`)
            .then(response => {
                const { telefones, ...clientInfo } = response.data;
                setClientData(clientInfo);
                setTelefones(telefones);
            })
            .catch(error => {
                console.error('Erro ao buscar cliente:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Erro',
                    text: 'Não foi possível carregar os dados do cliente.'
                });
            });
    }, [clientId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setClientData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePhoneChange = (index, value) => {
        const updatedPhones = [...telefones];
        updatedPhones[index] = value;
        setTelefones(updatedPhones);
    };

    const handleAddPhone = () => {
        setTelefones([...telefones, '']);
    };

    const handleRemovePhone = (index) => {
        if (telefones.length > 1 && index > 0) {
            const updatedPhones = telefones.filter((_, i) => i !== index);
            setTelefones(updatedPhones);
        }
    };

    const handleCEPBlur = () => {
        const { cep } = clientData;
        if (cep) {
            axios.get(`https://viacep.com.br/ws/${cep.replace(/\D/g, '')}/json/`)
                .then(response => {
                    if (response.data.erro) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Erro',
                            text: 'CEP não encontrado.'
                        });
                    } else {
                        setClientData(prev => ({
                            ...prev,
                            rua: response.data.logradouro,
                            bairro: response.data.bairro,
                            cidade: response.data.localidade,
                            estado: response.data.uf
                        }));
                    }
                })
                .catch(() => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Erro',
                        text: 'Erro ao buscar o CEP. Tente novamente.'
                    });
                });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!clientData.nome || !clientData.cpf || !clientData.email || !telefones[0]) {
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'Por favor, preencha todos os campos obrigatórios.'
            });
            return;
        }

        // Remove pontos e traços do CPF antes de enviar
        const sanitizedCPF = clientData.cpf.replace(/[.-]/g, '');

        const updatedClient = {
            ...clientData,
            cpf: sanitizedCPF,
            telefones
        };

        axios.put(`http://localhost:5000/api/clientes/${clientId}`, updatedClient)
            .then(response => {
                Swal.fire({
                    icon: 'success',
                    title: 'Cliente atualizado com sucesso!',
                    confirmButtonText: 'OK'
                }).then(() => {
                    onBackClick(); // Volta para a página de listagem de clientes
                });
            })
            .catch(error => {
                console.error('Erro ao atualizar cliente:', error);

                let errorMessage = 'Erro ao atualizar o cliente. Tente novamente mais tarde.';
                if (error.response && error.response.data) {
                    errorMessage = error.response.data; // Use a mensagem de erro que veio do backend
                }

                Swal.fire({
                    icon: 'error',
                    title: 'Erro',
                    text: errorMessage
                });
            });
    };

    return (
        <div className={styles.clientRegistrationContainer}>
            <h2 className={styles.header}>Editar Cliente</h2>
            <form onSubmit={handleSubmit} className={styles.clientForm}>
                {/* Seção de Dados Pessoais */}
                <fieldset className={styles.fieldset}>
                    <legend>Dados Pessoais</legend>
                    <div className={styles.section}>
                        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                            <label>Nome*</label>
                            <input type="text" name="nome" value={clientData.nome} onChange={handleChange} required />
                        </div>
                        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                            <label>Email*</label>
                            <input type="email" name="email" value={clientData.email} onChange={handleChange} required />
                        </div>
                        <div className={styles.formGroup}>
                            <label>CPF*</label>
                            <input type="text" name="cpf" value={clientData.cpf} onChange={handleChange} required />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Data de Nascimento</label>
                            <input type="date" name="data_nascimento" value={clientData.data_nascimento} onChange={handleChange} />
                        </div>
                        <div className={styles.formGroup}>
                            <label>RG</label>
                            <input type="text" name="rg" value={clientData.rg} onChange={handleChange} />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Sexo</label>
                            <select name="sexo" value={clientData.sexo} onChange={handleChange}>
                                <option value="">Selecione</option>
                                <option value="Masculino">Masculino</option>
                                <option value="Feminino">Feminino</option>
                                <option value="Outro">Outro</option>
                            </select>
                        </div>
                        <div className={`${styles.formGroup} ${styles.profissaoField}`}>
                            <label>Profissão</label>
                            <input type="text" name="profissao" value={clientData.profissao} onChange={handleChange} />
                        </div>
                    </div>
                </fieldset>

                {/* Seção de Endereço */}
                <fieldset className={styles.fieldset}>
                    <legend>Endereço</legend>
                    <div className={styles.section}>
                        <div className={styles.formGroup}>
                            <label>CEP</label>
                            <input type="text" name="cep" value={clientData.cep} onChange={handleChange} onBlur={handleCEPBlur} />
                        </div>
                        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                            <label>Rua</label>
                            <input type="text" name="rua" value={clientData.rua} onChange={handleChange} />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Número</label>
                            <input type="text" name="numero" value={clientData.numero} onChange={handleChange} />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Bairro</label>
                            <input type="text" name="bairro" value={clientData.bairro} onChange={handleChange} />
                        </div>
                        <div className={`${styles.formGroup} ${styles.wide}`}>
                            <label>Cidade</label>
                            <input type="text" name="cidade" value={clientData.cidade} onChange={handleChange} />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Estado</label>
                            <select name="estado" value={clientData.estado} onChange={handleChange}>
                                <option value="">Selecione</option>
                                <option value="AC">Acre</option>
                                <option value="AL">Alagoas</option>
                                <option value="AP">Amapá</option>
                                <option value="AM">Amazonas</option>
                                <option value="BA">Bahia</option>
                                <option value="CE">Ceará</option>
                                <option value="DF">Distrito Federal</option>
                                <option value="ES">Espírito Santo</option>
                                <option value="GO">Goiás</option>
                                <option value="MA">Maranhão</option>
                                <option value="MT">Mato Grosso</option>
                                <option value="MS">Mato Grosso do Sul</option>
                                <option value="MG">Minas Gerais</option>
                                <option value="PA">Pará</option>
                                <option value="PB">Paraíba</option>
                                <option value="PR">Paraná</option>
                                <option value="PE">Pernambuco</option>
                                <option value="PI">Piauí</option>
                                <option value="RJ">Rio de Janeiro</option>
                                <option value="RN">Rio Grande do Norte</option>
                                <option value="RS">Rio Grande do Sul</option>
                                <option value="RO">Rondônia</option>
                                <option value="RR">Roraima</option>
                                <option value="SC">Santa Catarina</option>
                                <option value="SP">São Paulo</option>
                                <option value="SE">Sergipe</option>
                                <option value="TO">Tocantins</option>
                            </select>
                        </div>
                    </div>
                </fieldset>

                {/* Seção de Telefones */}
                <fieldset className={styles.fieldset}>
                    <legend>Telefones</legend>
                    <div className={styles.phonesSection}>
                        {telefones.map((telefone, index) => (
                            <div key={index} className={styles.phoneItem}>
                                <input
                                    type="text"
                                    value={telefone}
                                    onChange={(e) => handlePhoneChange(index, e.target.value)}
                                    required={index === 0}
                                    placeholder="(XX) XXXXX-XXXX"
                                />
                                {index > 0 && (
                                    <button type="button" className={styles.removePhoneButton} onClick={() => handleRemovePhone(index)}>
                                        <FontAwesomeIcon icon={faMinus} /> Remover
                                    </button>
                                )}
                            </div>
                        ))}
                        <button type="button" className={styles.addPhoneButton} onClick={handleAddPhone}>
                            <FontAwesomeIcon icon={faPlus} /> Adicionar Telefone
                        </button>
                    </div>
                </fieldset>

                {/* Ações do Formulário */}
                <div className={styles.formActions}>
                    <button type="submit" className={styles.submitButton}>Atualizar</button>
                    <button type="button" className={styles.backButton} onClick={onBackClick}>Voltar</button>
                </div>
            </form>
        </div>
    );
}

export default EditClient;
