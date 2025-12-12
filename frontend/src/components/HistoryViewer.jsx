import { useEffect, useState } from 'react';
import { fetchHistory } from '../services/historyService.js';

function HistoryViewer() {
  const [history, setHistory] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const loadHistory = async () => {
    setListLoading(true);
    try {
      const data = await fetchHistory();
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
    loadHistory();
  }, []);

  return (
    <section className="crud-section">
      <div className="crud-header">
        <h2>Histórico de Acessos</h2>
        <p>Visualize eventos autorizados ou negados e registre ocorrências.</p>
      </div>

      {feedback && (
        <div className={`feedback ${feedback.type}`}>
          <p>{feedback.message}</p>
        </div>
      )}

      <div className="card crud-table">
        <div className="crud-table-header">
          <h3>Eventos registrados</h3>
          <button type="button" className="ghost" onClick={loadHistory} disabled={listLoading}>
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
