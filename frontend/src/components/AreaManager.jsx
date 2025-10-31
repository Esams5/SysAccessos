import { useEffect, useState } from 'react';
import { createArea, deleteArea, fetchAreas, updateArea } from '../services/areaService.js';

const initialState = {
  name: '',
  description: '',
  location: '',
  securityLevel: 'RESTRITA',
  notes: '',
  active: true
};

function AreaManager() {
  const [areas, setAreas] = useState([]);
  const [formData, setFormData] = useState(initialState);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const formatUsageStatus = (status, active) => {
    if (!active) {
      return 'Inativa';
    }
    if (!status) {
      return 'Disponível';
    }
    switch (status.toLowerCase()) {
      case 'disponivel':
        return 'Disponível';
      case 'emuso':
        return 'Em uso';
      case 'naodevolvida':
        return 'Não devolvida';
      default:
        return status;
    }
  };

  const formatDateTime = (value) => {
    if (!value) {
      return '—';
    }
    try {
      return new Date(value).toLocaleString();
    } catch (error) {
      return '—';
    }
  };

  const loadAreas = async () => {
    setListLoading(true);
    try {
      const data = await fetchAreas();
      setAreas(data);
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error.response?.data?.message || 'Não foi possível carregar as áreas.'
      });
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    loadAreas();
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
      ...formData,
      name: formData.name.trim(),
      description: formData.description.trim(),
      location: formData.location.trim(),
      securityLevel: formData.securityLevel.trim(),
      notes: formData.notes.trim() || ''
    };

    try {
      if (editingId) {
        await updateArea(editingId, payload);
        setFeedback({ type: 'success', message: 'Área atualizada com sucesso.' });
      } else {
        await createArea(payload);
        setFeedback({ type: 'success', message: 'Área criada com sucesso.' });
      }
      resetForm();
      await loadAreas();
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao salvar área.';
      const errors = error.response?.data?.errors;
      setFeedback({ type: 'error', message, errors });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (area) => {
    setEditingId(area.id);
    setFormData({
      name: area.name,
      description: area.description,
      location: area.location,
      securityLevel: area.securityLevel,
      notes: area.notes || '',
      active: area.active
    });
    setFeedback(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deseja realmente remover esta área?')) {
      return;
    }

    setLoading(true);
    setFeedback(null);
    try {
      await deleteArea(id);
      setFeedback({ type: 'success', message: 'Área removida.' });
      if (editingId === id) {
        resetForm();
      }
      await loadAreas();
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao remover área.';
      setFeedback({ type: 'error', message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="crud-section">
      <div className="crud-header">
        <h2>Áreas de Acesso</h2>
        <p>Cadastre os espaços controlados e nivele a segurança.</p>
      </div>

      <form className="card crud-form" onSubmit={handleSubmit}>
        <div className="grid">
          <div className="field">
            <label htmlFor="name">Nome da área</label>
            <input id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="field">
            <label htmlFor="description">Descrição</label>
            <input
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="location">Localização</label>
            <input id="location" name="location" value={formData.location} onChange={handleChange} required />
          </div>
          <div className="field">
            <label htmlFor="securityLevel">Nível de segurança</label>
            <select
              id="securityLevel"
              name="securityLevel"
              value={formData.securityLevel}
              onChange={handleChange}
              required
            >
              <option value="RESTRITA">Restrita</option>
              <option value="CONFIDENCIAL">Confidencial</option>
              <option value="GERAL">Geral</option>
              <option value="CRITICA">Crítica</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="notes">Observações</label>
            <textarea id="notes" name="notes" rows={3} value={formData.notes} onChange={handleChange} />
          </div>
        </div>

        <label className="checkbox">
          <input type="checkbox" name="active" checked={formData.active} onChange={handleChange} />
          Área ativa
        </label>

        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? 'Salvando...' : editingId ? 'Atualizar área' : 'Cadastrar área'}
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
          <h3>Áreas cadastradas</h3>
          <button type="button" className="ghost" onClick={loadAreas} disabled={listLoading}>
            {listLoading ? 'Atualizando...' : 'Atualizar lista'}
          </button>
        </div>
        {areas.length === 0 ? (
          <p className="empty">Nenhuma área cadastrada.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Descrição</th>
                  <th>Localização</th>
                  <th>Nível</th>
                  <th>Situação de uso</th>
                  <th>Responsável atual</th>
                  <th>Prazo limite</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {areas.map((area) => (
                  <tr key={area.id}>
                    <td>{area.name}</td>
                    <td>{area.description}</td>
                    <td>{area.location}</td>
                    <td>{area.securityLevel}</td>
                    <td>{formatUsageStatus(area.status, area.active)}</td>
                    <td>
                      {area.inUse ? (
                        <div className="stacked">
                          <span>{area.occupantName || 'Em uso'}</span>
                          {area.occupantCardIdentifier && <small>Cartão: {area.occupantCardIdentifier}</small>}
                        </div>
                      ) : (
                        <span>—</span>
                      )}
                    </td>
                    <td>{formatDateTime(area.usageDeadline)}</td>
                    <td>
                      <div className="table-actions">
                        <button type="button" onClick={() => handleEdit(area)}>
                          Editar
                        </button>
                        <button type="button" className="danger" onClick={() => handleDelete(area.id)}>
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

export default AreaManager;
