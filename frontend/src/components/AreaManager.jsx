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

const inlineInitialState = {
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
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [inlineEditingId, setInlineEditingId] = useState(null);
  const [inlineDraft, setInlineDraft] = useState(inlineInitialState);
  const [inlineErrors, setInlineErrors] = useState({});
  const [inlineSaving, setInlineSaving] = useState(false);
  const [inlineFeedback, setInlineFeedback] = useState(null);

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

  const validateInline = (draft) => {
    const errors = {};
    if (!draft.name.trim()) {
      errors.name = 'Informe o nome da área.';
    }
    if (!draft.description.trim()) {
      errors.description = 'Informe a descrição.';
    }
    if (!draft.location.trim()) {
      errors.location = 'Informe a localização.';
    }
    return errors;
  };

  const startInlineEdit = (area) => {
    setInlineEditingId(area.id);
    setInlineDraft({
      name: area.name ?? '',
      description: area.description ?? '',
      location: area.location ?? '',
      securityLevel: area.securityLevel ?? 'RESTRITA',
      notes: area.notes ?? '',
      active: Boolean(area.active)
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
    const { name, value, type, checked } = event.target;
    const nextValue = type === 'checkbox' ? checked : value;
    setInlineDraft((prev) => {
      const updated = {
        ...prev,
        [name]: nextValue
      };
      setInlineErrors(validateInline(updated));
      return updated;
    });
  };

  const handleInlineSave = async (areaId) => {
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
        description: inlineDraft.description.trim(),
        location: inlineDraft.location.trim(),
        securityLevel: inlineDraft.securityLevel,
        notes: inlineDraft.notes.trim(),
        active: inlineDraft.active
      };

      const updatedArea = await updateArea(areaId, payload);
      setAreas((prev) => prev.map((area) => (area.id === areaId ? updatedArea : area)));
      setInlineFeedback({ id: areaId, type: 'success', message: 'Área atualizada com sucesso.' });
      setInlineEditingId(null);
      setInlineDraft(inlineInitialState);
      setInlineErrors({});
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao atualizar área.';
      const errors = error.response?.data?.errors;
      setInlineFeedback({ id: areaId, type: 'error', message, errors });
    } finally {
      setInlineSaving(false);
    }
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
      ...formData,
      name: formData.name.trim(),
      description: formData.description.trim(),
      location: formData.location.trim(),
      securityLevel: formData.securityLevel.trim(),
      notes: formData.notes.trim() || ''
    };

    try {
      await createArea(payload);
      setFeedback({ type: 'success', message: 'Área criada com sucesso.' });
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

  const handleDelete = async (id) => {
    if (!window.confirm('Deseja realmente remover esta área?')) {
      return;
    }

    setLoading(true);
    setFeedback(null);
    try {
      await deleteArea(id);
      setFeedback({ type: 'success', message: 'Área removida.' });
      if (inlineEditingId === id) {
        cancelInlineEdit();
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
            {loading ? 'Salvando...' : 'Cadastrar área'}
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
                {areas.map((area) => {
                  const isEditing = inlineEditingId === area.id;
                  const hasFeedback = inlineFeedback?.id === area.id;

                  return (
                    <tr key={area.id} className={isEditing ? 'table-row-editing' : undefined}>
                      <td>
                        {isEditing ? (
                          <div className="table-input">
                            <input name="name" value={inlineDraft.name} onChange={handleInlineChange} />
                            {inlineErrors.name && <small className="inline-error">{inlineErrors.name}</small>}
                          </div>
                        ) : (
                          area.name
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <div className="table-input">
                            <input name="description" value={inlineDraft.description} onChange={handleInlineChange} />
                            {inlineErrors.description && <small className="inline-error">{inlineErrors.description}</small>}
                          </div>
                        ) : (
                          area.description
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <div className="table-input">
                            <input name="location" value={inlineDraft.location} onChange={handleInlineChange} />
                            {inlineErrors.location && <small className="inline-error">{inlineErrors.location}</small>}
                          </div>
                        ) : (
                          area.location
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <div className="table-input">
                            <select name="securityLevel" value={inlineDraft.securityLevel} onChange={handleInlineChange}>
                              <option value="RESTRITA">Restrita</option>
                              <option value="CONFIDENCIAL">Confidencial</option>
                              <option value="GERAL">Geral</option>
                              <option value="CRITICA">Crítica</option>
                            </select>
                          </div>
                        ) : (
                          area.securityLevel
                        )}
                      </td>
                      <td>{formatUsageStatus(area.status, isEditing ? inlineDraft.active : area.active)}</td>
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
                          {isEditing ? (
                            <>
                              <label className="checkbox inline">
                                <input type="checkbox" name="active" checked={inlineDraft.active} onChange={handleInlineChange} />
                                Área ativa
                              </label>
                              <div className="table-input full">
                                <textarea
                                  name="notes"
                                  rows={2}
                                  value={inlineDraft.notes}
                                  onChange={handleInlineChange}
                                  placeholder="Observações"
                                />
                              </div>
                              <button type="button" onClick={() => handleInlineSave(area.id)} disabled={inlineSaving}>
                                {inlineSaving ? 'Salvando...' : 'Salvar'}
                              </button>
                              <button type="button" className="secondary" onClick={cancelInlineEdit} disabled={inlineSaving}>
                                Cancelar
                              </button>
                            </>
                          ) : (
                            <>
                              <button type="button" onClick={() => startInlineEdit(area)}>
                                Editar
                              </button>
                              <button type="button" className="danger" onClick={() => handleDelete(area.id)}>
                                Excluir
                              </button>
                            </>
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

export default AreaManager;
