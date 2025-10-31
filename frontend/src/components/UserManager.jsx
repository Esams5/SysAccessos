import { useEffect, useState } from 'react';
import { createUser, fetchUsers } from '../services/userService.js';

const initialState = {
  name: '',
  email: '',
  registrationCode: '',
  role: '',
  cardIdentifier: '',
  password: ''
};

function UserManager({ onUserCreated }) {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const loadUsers = async () => {
    setListLoading(true);
    try {
      const data = await fetchUsers();
      setUsers(data);
      onUserCreated?.(data);
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error.response?.data?.message || 'Não foi possível carregar os usuários.'
      });
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    const nextValue = name === 'registrationCode' || name === 'cardIdentifier' ? value.replace(/\D/g, '') : value;
    setFormData((prev) => ({
      ...prev,
      [name]: nextValue
    }));
  };

  const resetForm = () => {
    setFormData(initialState);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setFeedback(null);

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      registrationCode: formData.registrationCode.trim(),
      role: formData.role.trim(),
      cardIdentifier: formData.cardIdentifier.trim(),
      password: formData.password
    };

    try {
      await createUser(payload);
      setFeedback({ type: 'success', message: 'Usuário e cartão cadastrados com sucesso.' });
      resetForm();
      await loadUsers();
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao cadastrar usuário.';
      const errors = error.response?.data?.errors;
      setFeedback({ type: 'error', message, errors });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="crud-section">
      <div className="crud-header">
        <h2>Usuários e Cartões</h2>
        <p>Cadastre novos usuários administrados e associe cartões numéricos.</p>
      </div>

      <form className="card crud-form" onSubmit={handleSubmit}>
        <div className="grid">
          <div className="field">
            <label htmlFor="name">Nome completo</label>
            <input id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="field">
            <label htmlFor="registrationCode">Matrícula/Registro</label>
            <input
              id="registrationCode"
              name="registrationCode"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={40}
              value={formData.registrationCode}
              onChange={handleChange}
              placeholder="00001234"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="role">Função/Cargo</label>
            <input id="role" name="role" value={formData.role} onChange={handleChange} placeholder="Administrador" required />
          </div>
          <div className="field">
            <label htmlFor="cardIdentifier">Número do cartão</label>
            <input
              id="cardIdentifier"
              name="cardIdentifier"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={80}
              value={formData.cardIdentifier}
              onChange={handleChange}
              placeholder="0000998877"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="password">Senha</label>
            <input id="password" name="password" type="password" value={formData.password} onChange={handleChange} minLength={6} required />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? 'Salvando...' : 'Cadastrar usuário'}
          </button>
          <button type="button" className="secondary" onClick={resetForm} disabled={loading}>
            Limpar
          </button>
        </div>

        {feedback && (
          <div className={`feedback ${feedback.type}`}>
            <p>{feedback.message}</p>
            {feedback.errors && (
              <ul>
                {Object.entries(feedback.errors).map(([field, message]) => (
                  <li key={field}>
                    {field}: {message}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </form>

      <div className="card crud-table">
        <div className="crud-table-header">
          <h3>Usuários cadastrados</h3>
          <button type="button" className="ghost" onClick={loadUsers} disabled={listLoading}>
            {listLoading ? 'Atualizando...' : 'Atualizar lista'}
          </button>
        </div>
        {users.length === 0 ? (
          <p className="empty">Nenhum usuário cadastrado.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Matrícula</th>
                  <th>Função</th>
                  <th>Cartão</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.registrationCode}</td>
                    <td>{user.role}</td>
                    <td>{user.cardIdentifier}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

export default UserManager;
