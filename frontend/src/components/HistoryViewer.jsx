import { useEffect, useMemo, useState } from 'react';
import { fetchAreas } from '../services/areaService.js';
import { createHistoryEntry, fetchHistory } from '../services/historyService.js';
import { fetchUsers } from '../services/userService.js';

const initialState = {
  userId: '',
  areaId: '',
  eventType: 'ENTRADA',
  result: 'AUTORIZADO',
  cardIdentifier: '',
  notes: ''
};

function HistoryViewer() {
  const [history, setHistory] = useState([]);
  const [users, setUsers] = useState([]);
  const [areas, setAreas] = useState([]);
  const [formData, setFormData] = useState(initialState);
  const [filters, setFilters] = useState({ start: '', end: '' });
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

  const loadReferenceData = async () => {
    try {
      const [usersData, areasData] = await Promise.all([fetchUsers(), fetchAreas()]);
      setUsers(usersData);
      setAreas(areasData);
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error.response?.data?.message || 'Não foi possível carregar usuários/áreas.'
      });
    }
  };

  const loadHistory = async (params = {}) => {
    setListLoading(true);
    try {
      const data = await fetchHistory(params);
      setHistory(data);
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error.response?.data?.message || 'Não foi possível carregar o histórico.'
      });
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    loadReferenceData();
    loadHistory();
  }, []);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const applyFilters = () => {
    if (filters.start && filters.end) {
      loadHistory({ start: `${filters.start}T00:00:00Z`, end: `${filters.end}T23:59:59Z` });
    } else {
      loadHistory();
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    const nextValue = name === 'cardIdentifier' ? value.replace(/\D/g, '') : value;
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
      userId: Number(formData.userId),
      areaId: Number(formData.areaId),
      eventType: formData.eventType,
      result: formData.result,
      cardIdentifier: formData.cardIdentifier.trim(),
      notes: formData.notes.trim() || ''
    };

    try {
      await createHistoryEntry(payload);
      setFeedback({ type: 'success', message: 'Evento registrado no histórico.' });
      resetForm();
      await loadHistory(filters.start && filters.end ? { start: `${filters.start}T00:00:00Z`, end: `${filters.end}T23:59:59Z` } : {});
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao registrar evento.';
      const errors = error.response?.data?.errors;
      setFeedback({ type: 'error', message, errors });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="crud-section">
      <div className="crud-header">
        <h2>Histórico de Acessos</h2>
        <p>Visualize eventos autorizados ou negados e registre ocorrências.</p>
      </div>

      <div className="card filters">
        <div className="grid">
          <div className="field">
            <label htmlFor="start">Data inicial</label>
            <input id="start" name="start" type="date" value={filters.start} onChange={handleFilterChange} />
          </div>
          <div className="field">
            <label htmlFor="end">Data final</label>
            <input id="end" name="end" type="date" value={filters.end} onChange={handleFilterChange} />
          </div>
        </div>
        <div className="form-actions">
          <button type="button" onClick={applyFilters} disabled={listLoading}>
            {listLoading ? 'Filtrando...' : 'Aplicar filtro'}
          </button>
          <button type="button" className="secondary" onClick={() => { setFilters({ start: '', end: '' }); loadHistory(); }}>
            Limpar filtro
          </button>
        </div>
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
            <label htmlFor="eventType">Tipo de evento</label>
            <select id="eventType" name="eventType" value={formData.eventType} onChange={handleChange} required>
              <option value="ENTRADA">Entrada</option>
              <option value="SAIDA">Saída</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="result">Resultado</label>
            <select id="result" name="result" value={formData.result} onChange={handleChange} required>
              <option value="AUTORIZADO">Autorizado</option>
              <option value="NEGADO">Negado</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="cardIdentifier">Identificador do cartão</label>
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
          <div className="field full">
            <label htmlFor="notes">Observações</label>
            <textarea id="notes" name="notes" rows={3} value={formData.notes} onChange={handleChange} />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? 'Registrando...' : 'Registrar evento'}
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
          <h3>Eventos registrados</h3>
          <button type="button" className="ghost" onClick={() => loadHistory(filters.start && filters.end ? { start: `${filters.start}T00:00:00Z`, end: `${filters.end}T23:59:59Z` } : {})} disabled={listLoading}>
            {listLoading ? 'Atualizando...' : 'Atualizar lista'}
          </button>
        </div>
        {history.length === 0 ? (
          <p className="empty">Nenhum evento registrado.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Data/Hora</th>
                  <th>Nome</th>
                  <th>Nº do cartão</th>
                  <th>Área</th>
                  <th>Evento</th>
                  <th>Resultado</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr key={item.id}>
                    <td>{new Date(item.recordedAt).toLocaleString()}</td>
                    <td>
                      {item.userName}
                    </td>
                    <td>{item.cardIdentifier}</td>
                    <td>{item.areaName}</td>
                    <td>{item.eventType}</td>
                    <td>{item.result}</td>
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

export default HistoryViewer;
