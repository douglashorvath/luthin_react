import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import styles from './LuthierRegistration.module.css'; // Importando CSS Module

function LuthierRegistration({ onBackClick }) {
    const [luthier, setLuthier] = useState({
        nome: '',
        especialidade: '',
        email: '',
        telefone: '',
        passwd: ''
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Limitar o campo de telefone para aceitar apenas números
        if (name === 'telefone') {
            if (!/^\d*$/.test(value)) return; // Se não for número, ignore a entrada
        }

        setLuthier((prevLuthier) => ({
            ...prevLuthier,
            [name]: value
        }));
    };

    const validate = () => {
        let formErrors = {};
        if (!luthier.nome) formErrors.nome = "Nome é obrigatório.";
        if (!luthier.especialidade) formErrors.especialidade = "Especialidade é obrigatória.";
        if (!luthier.email) formErrors.email = "Email é obrigatório.";
        if (!luthier.telefone) formErrors.telefone = "Telefone é obrigatório.";
        if (!luthier.passwd) formErrors.passwd = "Senha é obrigatória.";
        if (luthier.passwd && luthier.passwd.length < 8) {
            formErrors.passwd = "A senha deve ter pelo menos 8 caracteres.";
        }
        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            axios.post('http://localhost:5000/api/luthier/register', luthier)
                .then(response => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Cadastro realizado com sucesso!',
                        confirmButtonText: 'Ok'
                    }).then(() => {
                        onBackClick(); // Redireciona o usuário de volta para a tela de login
                    });
                })
                .catch(error => {
                    console.error('Erro ao cadastrar luthier:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Erro ao cadastrar',
                        text: error.response?.data || 'Verifique os dados e tente novamente.'
                    });
                });
        }
    };

    return (
        <div className={styles['registration-container']}>
            <div className={styles['registration-box']}>
                <h2>Cadastro de Luthier</h2>
                <form onSubmit={handleSubmit} className={styles['registration-form']}>
                    <label>
                        Nome:
                        <input type="text" name="nome" value={luthier.nome} onChange={handleChange} required />
                        {errors.nome && <span className={styles['error-message']}>{errors.nome}</span>}
                    </label>
                    <label>
                        Especialidade:
                        <input type="text" name="especialidade" value={luthier.especialidade} onChange={handleChange} required />
                        {errors.especialidade && <span className={styles['error-message']}>{errors.especialidade}</span>}
                    </label>
                    <label>
                        Email:
                        <input type="email" name="email" value={luthier.email} onChange={handleChange} required />
                        {errors.email && <span className={styles['error-message']}>{errors.email}</span>}
                    </label>
                    <label>
                        Telefone:
                        <input type="text" name="telefone" value={luthier.telefone} onChange={handleChange} required />
                        {errors.telefone && <span className={styles['error-message']}>{errors.telefone}</span>}
                    </label>
                    <label>
                        Senha:
                        <input type="password" name="passwd" value={luthier.passwd} onChange={handleChange} required />
                        {errors.passwd && <span className={styles['error-message']}>{errors.passwd}</span>}
                    </label>
                    <button type="submit" className={styles['register-button']}>Cadastrar</button>
                    <button type="button" onClick={onBackClick} className={styles['back-button']}>Voltar</button>
                </form>
            </div>
        </div>
    );
}

export default LuthierRegistration;
