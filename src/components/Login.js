import React, { useState } from 'react';
import axios from 'axios';
import styles from './Login.module.css'; // Importando como CSS Module
import Swal from 'sweetalert2';

function Login({ onRegisterClick, onLoginSuccess }) {
    const [credentials, setCredentials] = useState({
        email: '',
        passwd: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleLogin = (e) => {
        e.preventDefault();
        axios.post('http://localhost:5000/api/luthier/login', credentials)
            .then(response => {
                // Salvando o nome do luthier no localStorage para persistência
                localStorage.setItem('luthierName', response.data.name);
                onLoginSuccess(response.data.name);
            })
            .catch(error => {
                console.error('Erro ao realizar login', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Erro ao realizar login',
                    text: 'Credenciais inválidas. Verifique suas informações e tente novamente.'
                });
            });
    };


    return (
        <div className={styles['login-container']}>
            <div className={styles['login-box']}>
                <h2>Login de Luthier</h2>
                <form onSubmit={handleLogin} className={styles['login-form']}>
                    <label>
                        Email:
                        <input type="email" name="email" value={credentials.email} onChange={handleChange} required />
                    </label>
                    <label>
                        Senha:
                        <input type="password" name="passwd" value={credentials.passwd} onChange={handleChange} required />
                    </label>
                    <button type="submit" className={styles['login-button']}>Entrar</button>
                    <button type="button" onClick={onRegisterClick} className={styles['register-button']}>Cadastrar-se</button>
                </form>
            </div>
        </div>
    );
}

export default Login;
