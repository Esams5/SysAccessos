import { useEffect, useState } from 'react';

const initialState = {
  name: '',
  email: '',
  password: ''
};

function AuthForm({ mode, onSubmit, loading }) {
  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    setFormData(initialState);
  }, [mode]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = {
      email: formData.email.trim(),
      password: formData.password
    };

    if (mode === 'register') {
      payload.name = formData.name.trim();
    }

    onSubmit(payload);
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2>{mode === 'login' ? 'Entrar' : 'Criar conta'}</h2>

      {mode === 'register' && (
        <div className="field">
          <label htmlFor="name">Nome completo</label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Maria Silva"
            required
          />
        </div>
      )}

      <div className="field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="email@exemplo.com"
          required
        />
      </div>

      <div className="field">
        <label htmlFor="password">Senha</label>
        <input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••"
          minLength={6}
          required
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Aguarde...' : mode === 'login' ? 'Entrar' : 'Cadastrar'}
      </button>
    </form>
  );
}

export default AuthForm;
