import { useState } from 'react';
import AuthForm from './components/AuthForm.jsx';
import UserManager from './components/UserManager.jsx';
import AreaManager from './components/AreaManager.jsx';
import PermissionManager from './components/PermissionManager.jsx';
import AccessSimulation from './components/AccessSimulation.jsx';
import HistoryViewer from './components/HistoryViewer.jsx';
import UserSelfService from './components/UserSelfService.jsx';
import Recommendations from './components/Recommendations.jsx';
import api from './services/api.js';

function App() {
  const [activeView, setActiveView] = useState('users');
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authenticatedUser, setAuthenticatedUser] = useState(null);

  const handleAuthSubmit = async (payload) => {
    setLoading(true);
    setFeedback(null);

    try {
      const { data } = await api.post('/auth/login', payload);
      const defaultMessage = data?.message || 'Login realizado.';

      if (data?.user) {
        setAuthenticatedUser(data.user);
        const isAdminUser = data.user.role?.toUpperCase() === 'ADMIN';
        setActiveView(isAdminUser ? 'users' : 'self-service');
      }

      setFeedback({
        type: 'success',
        message: defaultMessage,
        user: data?.user ?? null
      });
    } catch (error) {
      const message = error.response?.data?.message || 'Não foi possível completar a operação.';
      const errors = error.response?.data?.errors;
      setFeedback({
        type: 'error',
        message,
        errors
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setAuthenticatedUser(null);
    setActiveView('users');
    setFeedback(null);
  };

  const isAdmin = authenticatedUser?.role?.toUpperCase() === 'ADMIN';

  const adminViews = [
    { id: 'users', label: 'Usuários' },
    { id: 'areas', label: 'Áreas' },
    { id: 'permissions', label: 'Permissões' },
    { id: 'simulate', label: 'Simulação' },
    { id: 'history', label: 'Histórico' },
    { id: 'ai', label: 'IA / Recomendações' }
  ];

  return (
    <div className="layout">
      <header>
        <h1>SysAccessos</h1>
        <p>Controle de acesso com cadastro de usuários, permissões e histórico.</p>
        {authenticatedUser && (
          <div className="user-banner">
            <span>
              Logado como <strong>{authenticatedUser.name}</strong> ({authenticatedUser.role})
            </span>
            <button type="button" className="secondary" onClick={handleLogout}>
              Sair
            </button>
          </div>
        )}
      </header>

      {!authenticatedUser ? (
        <>
          <AuthForm onSubmit={handleAuthSubmit} loading={loading} />
          {feedback && (
            <div className={`feedback ${feedback.type}`}>
              <p>{feedback.message}</p>
              {feedback.user && (
                <div className="feedback-user">
                  <span>ID: {feedback.user.id}</span>
                  <span>Nome: {feedback.user.name}</span>
                  <span>Email: {feedback.user.email}</span>
                  {feedback.user.registrationCode && (
                    <span>Registro: {feedback.user.registrationCode}</span>
                  )}
                  {feedback.user.cardIdentifier && (
                    <span>Cartão: {feedback.user.cardIdentifier}</span>
                  )}
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
        </>
      ) : isAdmin ? (
        <>
          <nav className="nav-tabs">
            {adminViews.map((view) => (
              <button
                key={view.id}
                type="button"
                className={activeView === view.id ? 'active' : ''}
                onClick={() => {
                  setActiveView(view.id);
                  setFeedback(null);
                }}
              >
                {view.label}
              </button>
            ))}
          </nav>

          {activeView === 'users' && <UserManager />}
          {activeView === 'areas' && <AreaManager />}
          {activeView === 'permissions' && <PermissionManager />}
          {activeView === 'simulate' && <AccessSimulation />}
          {activeView === 'history' && <HistoryViewer />}
          {activeView === 'ai' && <Recommendations />}
        </>
      ) : (
        <UserSelfService user={authenticatedUser} />
      )}
    </div>
  );
}

export default App;
