import { useState } from 'react';
import { fetchRecommendations } from '../services/aiService.js';

function Recommendations() {
  const [cardIdentifier, setCardIdentifier] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleChange = (event) => {
    setCardIdentifier(event.target.value.replace(/\D/g, ''));
  };

  const handleFetch = async () => {
    const card = cardIdentifier.trim();
    if (!card) {
      setFeedback({ type: 'error', message: 'Informe o número do cartão para gerar recomendações.' });
      setRecommendations([]);
      return;
    }

    setLoading(true);
    setFeedback(null);
    try {
      const data = await fetchRecommendations(card);
      setRecommendations(data);
      if (data.length === 0) {
        setFeedback({
          type: 'success',
          message: 'Sem registros suficientes para recomendar novas áreas. Registre movimentações para gerar sugestões.'
        });
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Não foi possível gerar recomendações.';
      setFeedback({ type: 'error', message });
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="crud-section">
      <div className="crud-header">
        <h2>Recomendações com IA</h2>
        <p>Informe o cartão para visualizar áreas sugeridas com base no histórico recente.</p>
      </div>

      <form
        className="card crud-form"
        onSubmit={(event) => {
          event.preventDefault();
          handleFetch();
        }}
      >
        <div className="grid">
          <div className="field">
            <label htmlFor="cardIdentifier">Número do cartão</label>
            <input
              id="cardIdentifier"
              name="cardIdentifier"
              value={cardIdentifier}
              onChange={handleChange}
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={80}
              placeholder="0000998877"
              required
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? 'Gerando...' : 'Gerar recomendações'}
          </button>
          <button
            type="button"
            className="secondary"
            onClick={() => {
              setCardIdentifier('');
              setRecommendations([]);
              setFeedback(null);
            }}
            disabled={loading}
          >
            Limpar
          </button>
        </div>

        {feedback && (
          <div className={`feedback ${feedback.type}`}>
            <p>{feedback.message}</p>
          </div>
        )}
      </form>

      <div className="card crud-table">
        <div className="crud-table-header">
          <h3>Áreas sugeridas</h3>
        </div>
        {recommendations.length === 0 ? (
          <p className="empty">Nenhuma recomendação disponível.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Área</th>
                  <th>Acessos recentes</th>
                  <th>Último acesso</th>
                  <th>Motivo</th>
                </tr>
              </thead>
              <tbody>
                {recommendations.map((item) => (
                  <tr key={item.areaId}>
                    <td>{item.areaName}</td>
                    <td>{item.accessCount}</td>
                    <td>{item.lastAccessAt ? new Date(item.lastAccessAt).toLocaleString() : '—'}</td>
                    <td>{item.recommendationReason}</td>
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

export default Recommendations;
