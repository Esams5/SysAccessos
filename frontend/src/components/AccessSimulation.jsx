import { useState } from 'react';
import { fetchAuthorizedAreas, moveArea } from '../services/areaService.js';

const initialState = {
  cardIdentifier: '',
  areaId: '',
  notes: ''
};

function AccessSimulation() {
  const [areas, setAreas] = useState([]);
  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [areasLoading, setAreasLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    const nextValue = name === 'cardIdentifier' ? value.replace(/\D/g, '') : value;
    setFormData((prev) => ({
      ...prev,
      [name]: nextValue
    }));
  };

  const loadAuthorizedAreas = async () => {
    const card = formData.cardIdentifier.trim();
    if (!card) {
      setFeedback({
        type: 'error',
        message: 'Informe o número do cartão antes de buscar as salas autorizadas.'
      });
      return;
    }

    setAreasLoading(true);
    setFeedback(null);
    try {
      const data = await fetchAuthorizedAreas(card);
      setAreas(data);
      setFormData((prev) => {
        if (data.some((area) => String(area.id) === prev.areaId)) {
          return prev;
        }
        return {
          ...prev,
          areaId: data.length > 0 ? String(data[0].id) : ''
        };
      });
    } catch (error) {
      const message = error.response?.data?.message || 'Não foi possível carregar as salas autorizadas.';
      const errors = error.response?.data?.errors;
      setFeedback({ type: 'error', message, errors });
    } finally {
      setAreasLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const card = formData.cardIdentifier.trim();
    if (!card) {
      setFeedback({
        type: 'error',
        message: 'Informe o número do cartão.'
      });
      return;
    }
    if (!formData.areaId) {
      setFeedback({
        type: 'error',
        message: 'Selecione uma sala autorizada para registrar a movimentação.'
      });
      return;
    }

    setLoading(true);
    setFeedback(null);

    const payload = {
      cardIdentifier: card,
      areaId: Number(formData.areaId),
      notes: formData.notes.trim() || undefined
    };

    try {
      const data = await moveArea(payload);

      setAreas((prev) =>
        prev.map((area) =>
          area.id === data.areaId
            ? {
                ...area,
                status: data.status,
                inUse: data.inUse,
                occupantName: data.occupantName,
                occupantCardIdentifier: data.occupantCardIdentifier,
                lastMovementAt: data.lastMovementAt,
                usageDeadline: data.usageDeadline
              }
            : area
        )
      );

      setFeedback({
        type: 'success',
        message: data.message,
        movementType: data.movementType,
        status: data.status,
        occupantName: data.occupantName,
        occupantCardIdentifier: data.occupantCardIdentifier
      });
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao registrar a movimentação.';
      const errors = error.response?.data?.errors;
      setFeedback({ type: 'error', message, errors });
    } finally {
      setLoading(false);
      setFormData((prev) => ({ ...prev, notes: '' }));
    }
  };

  const resetForm = () => {
    setFormData({
      ...initialState,
      cardIdentifier: formData.cardIdentifier
    });
    setFeedback(null);
  };

  const formatStatus = (status) => {
    if (!status) return 'Indisponível';
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

  return (
    <section className="crud-section">
      <div className="crud-header">
        <h2>Movimentação de Salas</h2>
        <p>Informe o cartão para visualizar e atualizar as salas autorizadas para uso.</p>
      </div>

      <form className="card crud-form" onSubmit={handleSubmit}>
        <div className="grid">
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
            <label htmlFor="areaId">Sala autorizada</label>
            <select
              id="areaId"
              name="areaId"
              value={formData.areaId}
              onChange={handleChange}
              disabled={areas.length === 0}
              required
            >
              <option value="">{areas.length === 0 ? 'Nenhuma sala carregada' : 'Selecione a sala'}</option>
              {areas.map((area) => (
                <option key={area.id} value={area.id}>
                  {area.name} — {area.location}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Salas autorizadas</label>
            <button type="button" className="ghost" onClick={loadAuthorizedAreas} disabled={areasLoading}>
              {areasLoading ? 'Carregando...' : 'Buscar salas'}
            </button>
          </div>
          <div className="field full">
            <label htmlFor="notes">Observações</label>
            <textarea id="notes" name="notes" rows={3} value={formData.notes} onChange={handleChange} />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading || areas.length === 0}>
            {loading ? 'Registrando...' : 'Registrar movimentação'}
          </button>
          <button type="button" className="secondary" onClick={resetForm} disabled={loading}>
            Limpar
          </button>
        </div>

        {feedback && (
          <div className={`feedback ${feedback.type}`}>
            <p>{feedback.message}</p>
            {feedback.movementType && (
              <div className="feedback-user">
                <span>Movimento: {feedback.movementType}</span>
                <span>Status: {formatStatus(feedback.status)}</span>
                {feedback.occupantName && <span>Responsável: {feedback.occupantName}</span>}
                {feedback.occupantCardIdentifier && <span>Cartão: {feedback.occupantCardIdentifier}</span>}
              </div>
            )}
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
          <h3>Salas autorizadas</h3>
        </div>
        {areas.length === 0 ? (
          <p className="empty">
            {formData.cardIdentifier
              ? 'Nenhuma sala autorizada encontrada para este cartão ou os dados ainda não foram carregados.'
              : 'Informe o cartão e clique em "Buscar salas" para visualizar os ambientes autorizados.'}
          </p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Sala</th>
                  <th>Localização</th>
                  <th>Status</th>
                  <th>Responsável atual</th>
                  <th>Prazo limite</th>
                  <th>Última movimentação</th>
                </tr>
              </thead>
              <tbody>
                {areas.map((area) => (
                  <tr key={area.id}>
                    <td>{area.name}</td>
                    <td>{area.location}</td>
                    <td>{formatStatus(area.status)}</td>
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
                    <td>
                      {area.usageDeadline
                        ? new Date(area.usageDeadline).toLocaleString()
                        : '—'}
                    </td>
                    <td>
                      {area.lastMovementAt ? new Date(area.lastMovementAt).toLocaleString() : '—'}
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

export default AccessSimulation;
