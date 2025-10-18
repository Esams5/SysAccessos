import { useEffect, useState } from 'react';
import {
  createVisitor,
  deleteVisitor,
  fetchVisitors,
  updateVisitor
} from '../services/visitorService.js';

const initialState = {
  fullName: '',
  documentId: '',
  email: '',
  phone: '',
  company: '',
  notes: '',
  active: true
};

function VisitorManager() {
  const [visitors, setVisitors] = useState([]);
  const [formData, setFormData] = useState(initialState);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const loadVisitors = async () => {
    setListLoading(true);
    try {
      const data = await fetchVisitors();
      setVisitors(data);
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error.response?.data?.message || 'Não foi possível carregar os visitantes.'
      });
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    loadVisitors();
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData(initialState);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setFeedback(null);

    const payload = {
      ...formData,
      fullName: formData.fullName.trim(),
      documentId: formData.documentId.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      company: formData.company.trim(),
      notes: formData.notes.trim() || ''
    };

    try {
      if (editingId) {
        await updateVisitor(editingId, payload);
        setFeedback({ type: 'success', message: 'Visitante atualizado com sucesso.' });
      } else {
        await createVisitor(payload);
        setFeedback({ type: 'success', message: 'Visitante cadastrado com sucesso.' });
      }
      resetForm();
      await loadVisitors();
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao salvar visitante.';
      const errors = error.response?.data?.errors;
      setFeedback({ type: 'error', message, errors });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (visitor) => {
    setEditingId(visitor.id);
    setFormData({
      fullName: visitor.fullName,
      documentId: visitor.documentId,
      email: visitor.email,
      phone: visitor.phone,
      company: visitor.company,
      notes: visitor.notes || '',
      active: visitor.active
    });
    setFeedback(null);
  };

  const handleDelete = async (id) => {
    const confirmation = window.confirm('Deseja realmente remover este visitante?');
    if (!confirmation) {
      return;
    }

    setLoading(true);
    setFeedback(null);
    try {
      await deleteVisitor(id);
      setFeedback({ type: 'success', message: 'Visitante removido.' });
      if (editingId === id) {
        resetForm();
      }
      await loadVisitors();
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao remover visitante.';
      setFeedback({ type: 'error', message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="crud-section">
      <div className="crud-header">
        <h2>Gestão de Visitantes</h2>
        <p>Cadastre e mantenha os visitantes autorizados.</p>
      </div>

      <form className="card crud-form" onSubmit={handleSubmit}>
        <div className="grid">
          <div className="field">
            <label htmlFor="fullName">Nome completo</label>
            <input
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="documentId">Documento</label>
            <input
              id="documentId"
              name="documentId"
              value={formData.documentId}
              onChange={handleChange}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="email">E-mail</label>
            <input id="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="field">
            <label htmlFor="phone">Telefone</label>
            <input id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
          </div>
          <div className="field">
            <label htmlFor="company">Empresa</label>
            <input
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="notes">Observações</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
            />
          </div>
        </div>

        <label className="checkbox">
          <input
            type="checkbox"
            name="active"
            checked={formData.active}
            onChange={handleChange}
          />
          Ativo
        </label>

        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? 'Salvando...' : editingId ? 'Atualizar visitante' : 'Cadastrar visitante'}
          </button>
          {editingId && (
            <button type="button" className="secondary" onClick={resetForm} disabled={loading}>
              Cancelar edição
            </button>
          )}
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
          <h3>Visitantes cadastrados</h3>
          <button type="button" className="ghost" onClick={loadVisitors} disabled={listLoading}>
            {listLoading ? 'Atualizando...' : 'Atualizar lista'}
          </button>
        </div>
        {visitors.length === 0 ? (
          <p className="empty">Nenhum visitante cadastrado.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Documento</th>
                  <th>Email</th>
                  <th>Telefone</th>
                  <th>Empresa</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {visitors.map((visitor) => (
                  <tr key={visitor.id}>
                    <td>{visitor.fullName}</td>
                    <td>{visitor.documentId}</td>
                    <td>{visitor.email}</td>
                    <td>{visitor.phone}</td>
                    <td>{visitor.company}</td>
                    <td>{visitor.active ? 'Ativo' : 'Inativo'}</td>
                    <td>
                      <div className="table-actions">
                        <button type="button" onClick={() => handleEdit(visitor)}>
                          Editar
                        </button>
                        <button type="button" className="danger" onClick={() => handleDelete(visitor.id)}>
                          Excluir
                        </button>
                      </div>
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

export default VisitorManager;

