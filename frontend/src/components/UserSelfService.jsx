import { useEffect, useState } from 'react';
import { fetchAuthorizedAreas } from '../services/areaService.js';
import { fetchPermissionsByUser } from '../services/permissionService.js';
import { fetchHistoryByUser } from '../services/historyService.js';

function UserSelfService({ user }) {
  const [permissions, setPermissions] = useState([]);
  const [authorizedAreas, setAuthorizedAreas] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      return;
    }

    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [permissionsData, areasData, historyData] = await Promise.all([
          fetchPermissionsByUser(user.id),
          fetchAuthorizedAreas(user.cardIdentifier),
          fetchHistoryByUser(user.id)
        ]);
        setPermissions(permissionsData);
        setAuthorizedAreas(areasData);
        setHistory(historyData);
      } catch (err) {
        setError(err.response?.data?.message || 'Não foi possível carregar seus dados.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  if (!user) {
    return null;
  }

  return (
    <section className="crud-section">
      <div className="crud-header">
        <h2>Minha conta</h2>
        <p>Bem-vindo, {user.name}. Abaixo estão suas permissões e histórico.</p>
      </div>

      {loading && <p>Carregando dados...</p>}
      {error && <div className="feedback error">{error}</div>}

      {!loading && !error && (
        <>
          <div className="card crud-table">
            <div className="crud-table-header">
              <h3>Minhas permissões</h3>
            </div>
            {permissions.length === 0 ? (
              <p className="empty">Nenhuma permissão ativa registrada.</p>
            ) : (
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Área</th>
                      <th>Nível</th>
                      <th>Válida de</th>
                      <th>Válida até</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {permissions.map((permission) => (
                      <tr key={permission.id}>
                        <td>{permission.areaName}</td>
                        <td>{permission.accessLevel}</td>
                        <td>{permission.validFrom}</td>
                        <td>{permission.validUntil}</td>
                        <td>{permission.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="card crud-table">
            <div className="crud-table-header">
              <h3>Salas autorizadas</h3>
            </div>
            {authorizedAreas.length === 0 ? (
              <p className="empty">Nenhuma sala autorizada no momento.</p>
            ) : (
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Sala</th>
                      <th>Localização</th>
                      <th>Nível</th>
                      <th>Status</th>
                      <th>Observações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {authorizedAreas.map((area) => (
                      <tr key={area.id}>
                        <td>{area.name}</td>
                        <td>{area.location}</td>
                        <td>{area.securityLevel}</td>
                        <td>{area.status}</td>
                        <td>{area.notes || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="card crud-table">
            <div className="crud-table-header">
              <h3>Meu histórico de acessos</h3>
            </div>
            {history.length === 0 ? (
              <p className="empty">Nenhum evento registrado.</p>
            ) : (
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Data/Hora</th>
                      <th>Área</th>
                      <th>Evento</th>
                      <th>Resultado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((item) => (
                      <tr key={item.id}>
                        <td>{new Date(item.recordedAt).toLocaleString()}</td>
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
        </>
      )}
    </section>
  );
}

export default UserSelfService;
