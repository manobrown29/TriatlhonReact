import React, { useState, useEffect } from 'react';
import './home.css';

const API_URL = 'http://localhost:3000/races';

export default function TriathlonDashboard() {
  const [activeTab, setActiveTab] = useState('provas');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [races, setRaces] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    location: '',
    swimTime: '00:15:00',
    bikeTime: '00:35:00',
    runTime: '00:25:00',
  });

  useEffect(() => {
    fetchRaces();
  }, []);

  const fetchRaces = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Falha ao carregar dados do servidor');
      const data = await response.json();
      setRaces(data);
    } catch (error) {
      console.error('Erro ao conectar com o json-server:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddRace = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.location) {
      alert('Por favor, preencha o nome e o local da prova.');
      return;
    }

    const newRaceData = {
      ...formData,
      category: 'SPRINT',
      isPR: false,
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRaceData),
      });

      if (!response.ok) throw new Error('Erro ao salvar no servidor');

      const savedRace = await response.json();

      setRaces((prevRaces) => [savedRace, ...prevRaces]);
      setIsModalOpen(false);

      setFormData({
        title: '',
        date: new Date().toISOString().split('T')[0],
        location: '',
        swimTime: '00:15:00',
        bikeTime: '00:35:00',
        runTime: '00:25:00',
      });
    } catch (error) {
      alert('Erro ao salvar prova. Verifique se o json-server está rodando.');
      console.error(error);
    }
  };

  const handleDeleteRace = async (id) => {
    if (!confirm('Deseja realmente eliminar esta prova?')) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Erro ao excluir prova');

      setRaces((prevRaces) => prevRaces.filter((race) => race.id !== id));
    } catch (error) {
      alert('Erro ao eliminar prova do servidor.');
      console.error(error);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="actions-bar">
        <div className="tabs-container">
          <button
            className={`tab-button ${activeTab === 'provas' ? 'active' : ''}`}
            onClick={() => setActiveTab('provas')}
          >
            Minhas Provas ({races.length})
          </button>
          <button
            className={`tab-button ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            Estatísticas & Evolução
          </button>
        </div>

        <div className="buttons-container">
          <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
            Registrar Nova Prova Sprint
          </button>
        </div>
      </div>

      {activeTab === 'provas' && (
        <div className="races-list">
          {loading ? (
            <p style={{ color: '#8b949e', textAlign: 'center', margin: '40px 0' }}>
              Carregando provas...
            </p>
          ) : races.length === 0 ? (
            <p style={{ color: '#8b949e', textAlign: 'center', margin: '40px 0' }}>
              Nenhuma prova registrada. Clique em "Registrar Nova Prova Sprint" para começar!
            </p>
          ) : (
            races.map((race) => (
              <div key={race.id} className="race-card">
                <div className="race-card-header">
                  <div className="race-badges">
                    <span className="badge badge-cyan">SPRINT (750m / 20k / 5k)</span>
                    {race.isPR && (
                      <span className="badge badge-gold">
                        RECORDE PESSOAL (PR)
                      </span>
                    )}
                  </div>
                  <button
                    className="delete-btn"
                    title="Eliminar prova"
                    onClick={() => handleDeleteRace(race.id)}
                  >
                    ✕
                  </button>
                </div>

                <h2 className="race-title">{race.title}</h2>
                <div className="race-meta">
                  <span>{race.date}</span>
                  <span>•</span>
                  <span>{race.location}</span>
                </div>

                <div className="disciplines-grid">
                  <div className="discipline-box swim">
                    <div className="discipline-header cyan-text">
                      <span>Natação (750m)</span>
                    </div>
                    <div className="discipline-time">{race.swimTime}</div>
                  </div>

                  <div className="discipline-box bike">
                    <div className="discipline-header red-text">
                      <span>Ciclismo (20km)</span>
                    </div>
                    <div className="discipline-time">{race.bikeTime}</div>
                  </div>

                  <div className="discipline-box run">
                    <div className="discipline-header green-text">
                      <span>Corrida (5km)</span>
                    </div>
                    <div className="discipline-time">{race.runTime}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'stats' && (
        <div className="race-card" style={{ maxWidth: '100%' }}>
          <h2 className="race-title" style={{ marginBottom: '12px' }}>
            Resumo Geral (Sprint)
          </h2>
          <p style={{ color: '#8b949e' }}>
            Total de provas Sprint completadas: <strong>{races.length}</strong>
          </p>
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Registrar Prova Sprint</h3>
              <button
                className="close-btn"
                onClick={() => setIsModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddRace} className="modal-form">
              <div className="form-group">
                <label>Nome da Prova</label>
                <input
                  type="text"
                  name="title"
                  placeholder="Ex: Triathlon Sprint Caiobá"
                  value={formData.title}
                  onChange={handleInputChange}
                  required  
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Data</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Cidade / Local</label>
                  <input
                    type="text"
                    name="location"
                    placeholder="Ex: Matinhos - PR"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-section-title">Tempos das Modalidades</div>

              <div className="form-row-3">
                <div className="form-group">
                  <label className="cyan-text">Natação (750m)</label>
                  <input
                    type="text"
                    name="swimTime"
                    placeholder="00:15:00"
                    value={formData.swimTime}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="red-text">Ciclismo (20km)</label>
                  <input
                    type="text"
                    name="bikeTime"
                    placeholder="00:35:00"
                    value={formData.bikeTime}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="green-text">Corrida (5km)</label>
                  <input
                    type="text"
                    name="runTime"
                    placeholder="00:25:00"
                    value={formData.runTime}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Salvar Prova
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}