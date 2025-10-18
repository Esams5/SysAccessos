import { useEffect, useMemo, useState } from 'react';
import { fetchVisitors } from '../services/visitorService.js';
import {
  createVisit,
  deleteVisit,
  fetchVisits,
  updateVisit
} from '../services/visitService.js';

const initialState = {
  visitorId: '',
  hostName: '',
  purpose: '',
  visitDate: '',
  startTime: '',
  endTime: '',
  status: 'AGENDADA',
  notes: ''
};

function VisitManager() {
  const [visits, setVisits] = useState([]);
  const [visitors, setVisitors] = useState([]);
  const [formData, setFormData] = useState(initialState);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const visitorOptions = useMemo(
    () => visitors.map((visitor) => ({ value: visitor.id, label: visitor.fullName })),
    [visitors]
  );

  const loadVisitors = async () => {
    try {
      const data = await fetchVisitors();
      setVisitors(data);
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error.response?.data?.message || 'Não foi possível carregar os visitantes.'
      });
    }
  };

  const loadVisits = async () => {
    setListLoading(true);
    try {
      const data = await fetchVisits();
      setVisits(data);
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error.response?.data?.message || 'Não foi possível carregar os registros de visita.'
      });
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    loadVisitors();
    loadVisits();
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
      visitorId: Number(formData.visitorId),
      hostName: formData.hostName.trim(),
      purpose: formData.purpose.trim(),
      visitDate: formData.visitDate,
      startTime: formData.startTime,
      endTime: formData.endTime,
      status: formData.status.trim(),
      notes: formData.notes.trim() || ''
    };

    try {
      if (editingId) {
        await updateVisit(editingId, payload);
        setFeedback({ type: 'success', message: 'Visita atualizada com sucesso.' });
      } else {
        await createVisit(payload);
        setFeedback({ type: 'success', message: 'Visita cadastrada com sucesso.' });
      }
      resetForm();
      await loadVisits();
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao salvar visita.';
      const errors = error.response?.data?.errors;
      setFeedback({ type: 'error', message, errors });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (visit) => {
    setEditingId(visit.id);
    setFormData({
      visitorId: visit.visitorId,
      hostName: visit.hostName,
      purpose: visit.purpose,
      visitDate: visit.visitDate,
      startTime: visit.startTime,
      endTime: visit.endTime,
      status: visit.status,
      notes: visit.notes || ''
    });
    setFeedback(null);
  };

  const handleDelete = async (id) => {
    const confirmation = window.confirm('Deseja realmente remover este registro de visita?');
    if (!confirmation) {
      return;
    }

    setLoading(true);
    setFeedback(null);
    try {
      await deleteVisit(id);
      setFeedback({ type: 'success', message: 'Visita removida.' });
      if (editingId === id) {
        resetForm();
      }
      await loadVisits();
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao remover visita.';
      setFeedback({ type: 'error', message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="crud-section">
      <div className="crud-header">
        <h2>Agendamento de Visitas</h2>
        <p>Relacione visitantes às visitas planejadas ou realizadas.</p>
      </div>

      <form className="card crud-form" onSubmit={handleSubmit}>
        <div className="grid">
          <div className="field">
            <label htmlFor="visitorId">Visitante</label>
            <select
              id="visitorId"
              name="visitorId"
              value={formData.visitorId}
              onChange={handleChange}
              required
            >
              <option value="">Selecione um visitante</option>
              {visitorOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="hostName">Anfitrião</label>
            <input
              id="hostName"
              name="hostName"
              value={formData.hostName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="purpose">Propósito</label>
            <input
              id="purpose"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="visitDate">Data</label>
            <input
              id="visitDate"
              name="visitDate"
              type="date"
              value={formData.visitDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="startTime">Início</label>
            <input
              id="startTime"
              name="startTime"
              type="time"
              value={formData.startTime}
              onChange={handleChange}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="endTime">Término</label>
            <input
              id="endTime"
              name="endTime"
              type="time"
              value={formData.endTime}
              onChange={handleChange}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="status">Status</label>
            <select id="status" name="status" value={formData.status} onChange={handleChange} required>
              <option value="AGENDADA">Agendada</option>
              <option value="EM_ANDAMENTO">Em andamento</option>
              <option value="CONCLUIDA">Concluída</option>
              <option value="CANCELADA">Cancelada</option>
            </select>
          </div>
          <div className="field full">
            <label htmlFor="notes">Observações</label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              value={formData.notes}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? 'Salvando...' : editingId ? 'Atualizar visita' : 'Cadastrar visita'}
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
          <h3>Visitas registradas</h3>
          <button type="button" className="ghost" onClick={loadVisits} disabled={listLoading}>
            {listLoading ? 'Atualizando...' : 'Atualizar lista'}
          </button>
        </div>
        {visits.length === 0 ? (
          <p className="empty">Nenhuma visita cadastrada.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Visitante</th>
                  <th>Anfitrião</th>
                  <th>Propósito</th>
                  <th>Data</th>
                  <th>Início</th>
                  <th>Término</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {visits.map((visit) => (
                  <tr key={visit.id}>
                    <td>{visit.visitorName}</td>
                    <td>{visit.hostName}</td>
                    <td>{visit.purpose}</td>
                    <td>{visit.visitDate}</td>
                    <td>{visit.startTime}</td>
                    <td>{visit.endTime}</td>
                    <td>{visit.status}</td>
                    <td>
                      <div className="table-actions">
                        <button type="button" onClick={() => handleEdit(visit)}>
                          Editar
                        </button>
                        <button type="button" className="danger" onClick={() => handleDelete(visit.id)}>
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

export default VisitManager;

