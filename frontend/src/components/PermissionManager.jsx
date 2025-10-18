import { useEffect, useMemo, useState } from 'react';
import { fetchAreas } from '../services/areaService.js';
import {
  createPermission,
  deletePermission,
  fetchPermissions,
  updatePermission
} from '../services/permissionService.js';
import { fetchUsers } from '../services/userService.js';

const initialState = {
  userId: '',
  areaId: '',
  accessLevel: 'PADRAO',
  validFrom: '',
  validUntil: '',
  status: 'ATIVA',
  notes: ''
};

function PermissionManager() {
  const [permissions, setPermissions] = useState([]);
  const [users, setUsers] = useState([]);
  const [areas, setAreas] = useState([]);
  const [formData, setFormData] = useState(initialState);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const userOptions = useMemo(
    () => users.map((user) => ({ value: user.id, label: `${user.name} (${user.registrationCode})` })),
    [users]
  );
  const areaOptions = useMemo(
    () => areas.map((area) => ({ value: area.id, label: `${area.name} - ${area.location}` })),
    [areas]
  );

  const loadData = async () => {
    setListLoading(true);
    try {
      const [usersData, areasData, permissionsData] = await Promise.all([
        fetchUsers(),
        fetchAreas(),
        fetchPermissions()
      ]);
      setUsers(usersData);
      setAreas(areasData);
      setPermissions(permissionsData);
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error.response?.data?.message || 'Não foi possível carregar os dados.'
      });
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData(initialState);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setFeedback(null);

    const payload = {
      userId: Number(formData.userId),
      areaId: Number(formData.areaId),
      accessLevel: formData.accessLevel.trim(),
      validFrom: formData.validFrom,
      validUntil: formData.validUntil,
      status: formData.status.trim(),
      notes: formData.notes.trim() || ''
    };

    try {
      if (editingId) {
        await updatePermission(editingId, payload);
        setFeedback({ type: 'success', message: 'Permissão atualizada com sucesso.' });
      } else {
        await createPermission(payload);
        setFeedback({ type: 'success', message: 'Permissão criada com sucesso.' });
      }
      resetForm();
      const permissionsData = await fetchPermissions();
      setPermissions(permissionsData);
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao salvar permissão.';
      const errors = error.response?.data?.errors;
      setFeedback({ type: 'error', message, errors });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (permission) => {
    setEditingId(permission.id);
    setFormData({
      userId: permission.userId,
      areaId: permission.areaId,
      accessLevel: permission.accessLevel,
      validFrom: permission.validFrom,
      validUntil: permission.validUntil,
      status: permission.status,
      notes: permission.notes || ''
    });
    setFeedback(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deseja realmente remover esta permissão?')) {
      return;
    }

    setLoading(true);
    setFeedback(null);
    try {
      await deletePermission(id);
      setFeedback({ type: 'success', message: 'Permissão removida.' });
      if (editingId === id) {
        resetForm();
      }
      const permissionsData = await fetchPermissions();
      setPermissions(permissionsData);
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao remover permissão.';
      setFeedback({ type: 'error', message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="crud-section">
      <div className="crud-header">
        <h2>Permissões de Acesso</h2>
        <p>Relacione usuários às áreas com níveis e validade.</p>
      </div>

      <form className="card crud-form" onSubmit={handleSubmit}>
        <div className="grid">
          <div className="field">
            <label htmlFor="userId">Usuário</label>
            <select id="userId" name="userId" value={formData.userId} onChange={handleChange} required>
              <option value="">Selecione um usuário</option>
              {userOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="areaId">Área</label>
            <select id="areaId" name="areaId" value={formData.areaId} onChange={handleChange} required>
              <option value="">Selecione uma área</option>
              {areaOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="accessLevel">Nível de acesso</label>
            <select
              id="accessLevel"
              name="accessLevel"
              value={formData.accessLevel}
              onChange={handleChange}
              required
            >
              <option value="PADRAO">Padrão</option>
              <option value="SUPERVISOR">Supervisor</option>
              <option value="ADMIN">Administrador</option>
              <option value="VISITANTE">Visitante</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="validFrom">Válida a partir de</label>
            <input id="validFrom" name="validFrom" type="date" value={formData.validFrom} onChange={handleChange} required />
          </div>
          <div className="field">
            <label htmlFor="validUntil">Válida até</label>
            <input id="validUntil" name="validUntil" type="date" value={formData.validUntil} onChange={handleChange} required />
          </div>
          <div className="field">
            <label htmlFor="status">Status</label>
            <select id="status" name="status" value={formData.status} onChange={handleChange} required>
              <option value="ATIVA">Ativa</option>
              <option value="SUSPENSA">Suspensa</option>
              <option value="REVOGADA">Revogada</option>
              <option value="EXPIRADA">Expirada</option>
            </select>
          </div>
          <div className="field full">
            <label htmlFor="notes">Observações</label>
            <textarea id="notes" name="notes" rows={3} value={formData.notes} onChange={handleChange} />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? 'Salvando...' : editingId ? 'Atualizar permissão' : 'Cadastrar permissão'}
          </button>
          {editingId && (
            <button type="button" className="secondary" onClick={resetForm} disabled={loading}>
              Cancelar edição
            </button>
          )}
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
          <h3>Permissões cadastradas</h3>
          <button type="button" className="ghost" onClick={loadData} disabled={listLoading}>
            {listLoading ? 'Atualizando...' : 'Atualizar listas'}
          </button>
        </div>
        {permissions.length === 0 ? (
          <p className="empty">Nenhuma permissão cadastrada.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Usuário</th>
                  <th>Área</th>
                  <th>Nível</th>
                  <th>Válida</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {permissions.map((permission) => (
                  <tr key={permission.id}>
                    <td>
                      <div className="stacked">
                        <span>{permission.userName}</span>
                        <small>{permission.userEmail}</small>
                      </div>
                    </td>
                    <td>{permission.areaName}</td>
                    <td>{permission.accessLevel}</td>
                    <td>
                      <div className="stacked">
                        <span>De: {permission.validFrom}</span>
                        <small>Até: {permission.validUntil}</small>
                      </div>
                    </td>
                    <td>{permission.status}</td>
                    <td>
                      <div className="table-actions">
                        <button type="button" onClick={() => handleEdit(permission)}>
                          Editar
                        </button>
                        <button type="button" className="danger" onClick={() => handleDelete(permission.id)}>
                          Excluir
                        </button>
                      </div>
                    </td>
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

export default PermissionManager;
