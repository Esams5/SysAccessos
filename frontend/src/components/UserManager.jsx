import { useEffect, useState } from 'react';
import { createUser, fetchUsers, updateUser } from '../services/userService.js';

const buildInitialState = (mode = 'admin') => ({
  name: '',
  email: '',
  registrationCode: '',
  role: mode === 'admin' ? 'ADMIN' : '',
  cardIdentifier: '',
  password: ''
});

const inlineInitialState = {
  name: '',
  email: '',
  registrationCode: '',
  role: '',
  cardIdentifier: ''
};

const roleOptions = [
  { value: 'ADMIN', label: 'Administrador' },
  { value: 'PROFESSOR', label: 'Professor' },
  { value: 'ALUNO', label: 'Aluno' },
  { value: 'SERVIDOR', label: 'Servidor' }
];

const nonAdminRoleOptions = roleOptions.filter((option) => option.value !== 'ADMIN');

function UserManager({ onUserCreated }) {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState(buildInitialState('admin'));
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [inlineEditingId, setInlineEditingId] = useState(null);
  const [inlineDraft, setInlineDraft] = useState(inlineInitialState);
  const [inlineErrors, setInlineErrors] = useState({});
  const [inlineSaving, setInlineSaving] = useState(false);
  const [inlineFeedback, setInlineFeedback] = useState(null);
  const [createMode, setCreateMode] = useState('admin');

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

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      role: createMode === 'admin' ? 'ADMIN' : ''
    }));
  }, [createMode]);

  const validateInline = (draft) => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!draft.name.trim()) {
      errors.name = 'Informe o nome.';
    }
    if (!draft.email.trim()) {
      errors.email = 'Informe o email.';
    } else if (!emailRegex.test(draft.email.trim())) {
      errors.email = 'Email inválido.';
    }
    if (!draft.registrationCode.trim()) {
      errors.registrationCode = 'Informe a matrícula/registro.';
    }
    if (!draft.role.trim()) {
      errors.role = 'Informe a função.';
    }
    if (!draft.cardIdentifier.trim()) {
      errors.cardIdentifier = 'Informe o número do cartão.';
    }

    return errors;
  };

  const formatRole = (value) => roleOptions.find((option) => option.value === value)?.label || value;

  const startInlineEdit = (user) => {
    setInlineEditingId(user.id);
    setInlineDraft({
      name: user.name ?? '',
      email: user.email ?? '',
      registrationCode: user.registrationCode ?? '',
      role: user.role ?? '',
      cardIdentifier: user.cardIdentifier ?? ''
    });
    setInlineErrors({});
    setInlineFeedback(null);
  };

  const cancelInlineEdit = () => {
    setInlineEditingId(null);
    setInlineDraft(inlineInitialState);
    setInlineErrors({});
    setInlineFeedback(null);
  };

  const handleInlineChange = (event) => {
    const { name, value } = event.target;
    const nextValue = name === 'registrationCode' || name === 'cardIdentifier' ? value.replace(/\D/g, '') : value;

    setInlineDraft((prev) => {
      const updated = {
        ...prev,
        [name]: nextValue
      };
      setInlineErrors(validateInline(updated));
      return updated;
    });
  };

  const handleInlineSave = async (userId) => {
    const currentErrors = validateInline(inlineDraft);
    if (Object.keys(currentErrors).length > 0) {
      setInlineErrors(currentErrors);
      return;
    }

    setInlineSaving(true);
    setInlineFeedback(null);
    try {
      const payload = {
        name: inlineDraft.name.trim(),
        email: inlineDraft.email.trim(),
        registrationCode: inlineDraft.registrationCode.trim(),
        role: inlineDraft.role.trim(),
        cardIdentifier: inlineDraft.cardIdentifier.trim()
      };

      const updatedUser = await updateUser(userId, payload);
      setUsers((prev) => prev.map((user) => (user.id === userId ? updatedUser : user)));
      setInlineFeedback({ id: userId, type: 'success', message: 'Usuário atualizado com sucesso.' });
      setInlineEditingId(null);
      setInlineDraft(inlineInitialState);
      setInlineErrors({});
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao atualizar usuário.';
      const errors = error.response?.data?.errors;
      setInlineFeedback({ id: userId, type: 'error', message, errors });
    } finally {
      setInlineSaving(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    const nextValue = name === 'registrationCode' || name === 'cardIdentifier' ? value.replace(/\D/g, '') : value;
    setFormData((prev) => ({
      ...prev,
      [name]: nextValue
    }));
  };

  const resetForm = () => {
    setFormData(buildInitialState(createMode));
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

      <nav className="nav-tabs">
        <button
          type="button"
          className={createMode === 'admin' ? 'active' : ''}
          onClick={() => {
            setCreateMode('admin');
            setFeedback(null);
          }}
        >
          Cadastrar Administrador
        </button>
        <button
          type="button"
          className={createMode === 'colaborator' ? 'active' : ''}
          onClick={() => {
            setCreateMode('colaborator');
            setFeedback(null);
          }}
        >
          Cadastrar Colaboradores
        </button>
      </nav>

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
            {createMode === 'admin' ? (
              <input id="role" name="role" value="ADMIN" disabled />
            ) : (
              <select id="role" name="role" value={formData.role} onChange={handleChange} required>
                <option value="">Selecione</option>
                {nonAdminRoleOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
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
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const isEditing = inlineEditingId === user.id;
                  const hasFeedback = inlineFeedback?.id === user.id;

                  return (
                    <tr key={user.id} className={isEditing ? 'table-row-editing' : undefined}>
                      <td>
                        {isEditing ? (
                          <div className="table-input">
                            <input name="name" value={inlineDraft.name} onChange={handleInlineChange} />
                            {inlineErrors.name && <small className="inline-error">{inlineErrors.name}</small>}
                          </div>
                        ) : (
                          user.name
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <div className="table-input">
                            <input name="email" type="email" value={inlineDraft.email} onChange={handleInlineChange} />
                            {inlineErrors.email && <small className="inline-error">{inlineErrors.email}</small>}
                          </div>
                        ) : (
                          user.email
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <div className="table-input">
                            <input
                              name="registrationCode"
                              value={inlineDraft.registrationCode}
                              onChange={handleInlineChange}
                              inputMode="numeric"
                              pattern="[0-9]*"
                              maxLength={40}
                            />
                            {inlineErrors.registrationCode && <small className="inline-error">{inlineErrors.registrationCode}</small>}
                          </div>
                        ) : (
                          user.registrationCode
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <div className="table-input">
                            <select name="role" value={inlineDraft.role} onChange={handleInlineChange}>
                              <option value="">Selecione</option>
                              {roleOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                            {inlineErrors.role && <small className="inline-error">{inlineErrors.role}</small>}
                          </div>
                        ) : (
                          formatRole(user.role)
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <div className="table-input">
                            <input
                              name="cardIdentifier"
                              value={inlineDraft.cardIdentifier}
                              onChange={handleInlineChange}
                              inputMode="numeric"
                              pattern="[0-9]*"
                              maxLength={80}
                            />
                            {inlineErrors.cardIdentifier && <small className="inline-error">{inlineErrors.cardIdentifier}</small>}
                          </div>
                        ) : (
                          user.cardIdentifier
                        )}
                      </td>
                      <td>
                        <div className="table-actions">
                          {isEditing ? (
                            <>
                              <button type="button" onClick={() => handleInlineSave(user.id)} disabled={inlineSaving}>
                                {inlineSaving ? 'Salvando...' : 'Salvar'}
                              </button>
                              <button type="button" className="secondary" onClick={cancelInlineEdit} disabled={inlineSaving}>
                                Cancelar
                              </button>
                            </>
                          ) : (
                            <button type="button" onClick={() => startInlineEdit(user)}>Editar</button>
                          )}
                        </div>
                        {hasFeedback && (
                          <div className={`inline-message ${inlineFeedback.type}`}>
                            <span>{inlineFeedback.message}</span>
                            {inlineFeedback.errors && (
                              <ul>
                                {Object.entries(inlineFeedback.errors).map(([field, message]) => (
                                  <li key={field}>
                                    {field}: {message}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

export default UserManager;
