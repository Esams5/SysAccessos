import { useState } from 'react';
import AuthForm from './components/AuthForm.jsx';
import VisitorManager from './components/VisitorManager.jsx';
import VisitManager from './components/VisitManager.jsx';
import api from './services/api.js';

const views = [
  { id: 'auth-login', label: 'Entrar' },
  { id: 'auth-register', label: 'Criar conta' },
  { id: 'visitors', label: 'Visitantes' },
  { id: 'visits', label: 'Visitas' }
];

function App() {
  const [activeView, setActiveView] = useState('auth-login');
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAuthSubmit = async (payload) => {
    const currentMode = activeView === 'auth-login' ? 'login' : 'register';
    setLoading(true);
    setFeedback(null);

    const endpoint = currentMode === 'login' ? '/auth/login' : '/auth/register';

    try {
      const { data } = await api.post(endpoint, payload);
      const defaultMessage = data?.message || 'Operação realizada com sucesso.';
      if (currentMode === 'register') {
        setActiveView('auth-login');
      }

      setFeedback({
        type: 'success',
        message:
          currentMode === 'register'
            ? `${defaultMessage} Agora faça login com suas credenciais.`
            : defaultMessage,
        user: currentMode === 'login' ? data?.user ?? null : null
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

  return (
    <div className="layout">
      <header>
        <h1>SysAccessos</h1>
        <p>Autenticação, cadastro de visitantes e agendamento de visitas.</p>
      </header>

      <nav className="nav-tabs">
        {views.map((view) => (
          <button
            key={view.id}
            type="button"
            className={activeView === view.id ? 'active' : ''}
            onClick={() => {
              setActiveView(view.id);
              if (!view.id.startsWith('auth')) {
                setFeedback(null);
              }
            }}
          >
            {view.label}
          </button>
        ))}
      </nav>

      {activeView === 'auth-login' || activeView === 'auth-register' ? (
        <>
          <AuthForm
            mode={activeView === 'auth-login' ? 'login' : 'register'}
            onSubmit={handleAuthSubmit}
            loading={loading}
          />
          {feedback && (
            <div className={`feedback ${feedback.type}`}>
              <p>{feedback.message}</p>
              {feedback.user && (
                <div className="feedback-user">
                  <span>ID: {feedback.user.id}</span>
                  <span>Nome: {feedback.user.name}</span>
                  <span>Email: {feedback.user.email}</span>
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
      ) : null}

      {activeView === 'visitors' && <VisitorManager />}
      {activeView === 'visits' && <VisitManager />}
    </div>
  );
}

export default App;
