import { useEffect, useState } from 'react';

const initialState = {
  name: '',
  email: '',
  registrationCode: '',
  role: '',
  cardIdentifier: '',
  password: ''
};

function AuthForm({ mode, onSubmit, loading }) {
  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    setFormData(initialState);
  }, [mode]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    const nextValue =
      name === 'registrationCode' || name === 'cardIdentifier'
        ? value.replace(/\D/g, '')
        : value;
    setFormData((prev) => ({
      ...prev,
      [name]: nextValue
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
      payload.registrationCode = formData.registrationCode.trim();
      payload.role = formData.role.trim();
      payload.cardIdentifier = formData.cardIdentifier.trim();
    }

    onSubmit(payload);
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2>{mode === 'login' ? 'Entrar' : 'Criar conta'}</h2>

      {mode === 'register' && (
        <>
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

          <div className="field">
            <label htmlFor="registrationCode">Matrícula/Registro</label>
            <input
              id="registrationCode"
              name="registrationCode"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={40}
              value={formData.registrationCode}
              onChange={handleChange}
              placeholder="00001234"
              required
            />
          </div>

          <div className="field">
            <label htmlFor="role">Função/Cargo</label>
            <input
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              placeholder="Coordenação"
              required
            />
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
        </>
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
