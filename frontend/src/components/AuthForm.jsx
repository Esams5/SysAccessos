import { useState } from 'react';

const initialState = {
  email: '',
  password: ''
};

function AuthForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState(initialState);

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

    onSubmit(payload);
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2>Entrar</h2>

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
        {loading ? 'Aguarde...' : 'Entrar'}
      </button>
    </form>
  );
}

export default AuthForm;
