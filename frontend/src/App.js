
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaWeight, FaRulerVertical, FaHistory } from 'react-icons/fa';

function App() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmi, setBmi] = useState(null);
  const [category, setCategory] = useState('');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/history');
      setHistory(res.data);
    } catch (err) {
      console.error('Error fetching history:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!weight || !height) {
      alert('Please enter both weight and height!');
      return;
    }
    try {
      const res = await axios.post('http://localhost:5000/api/bmi', {
        weight: parseFloat(weight),
        height: parseFloat(height)
      });
      setBmi(res.data.bmi);
      setCategory(res.data.category);
      fetchHistory();
      setWeight('');
      setHeight('');
    } catch (err) {
      console.error('Error calculating BMI:', err);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <>
      {/* Gradient Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark" style={{ background: 'linear-gradient(90deg, #0D47A1, #00ACC1)' }}>
        <div className="container">
          <a className="navbar-brand fw-bold" href="/">BMI Calculator</a>
        </div>
      </nav>

      <div className="container">
        <div className="card shadow p-4 fade-in mt-4" style={{ backgroundColor: '#f0f9ff' }}>
          <h2 className="mb-4 text-center" style={{ color: '#00796B' }}>Check Your BMI</h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">
                <FaWeight /> Weight (kg)
              </label>
              <input
                type="number"
                className="form-control"
                placeholder="Enter your weight"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                step="0.1"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">
                <FaRulerVertical /> Height (cm)
              </label>
              <input
                type="number"
                className="form-control"
                placeholder="Enter your height"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                step="0.1"
              />
            </div>
            <button type="submit" className="btn btn-info w-100 fw-bold">
              Calculate BMI
            </button>
          </form>

          {bmi && (
            <div className="mt-4">
              <div className={`alert ${bmi < 18.5 ? 'alert-warning' : bmi < 25 ? 'alert-success' : 'alert-danger'}`} role="alert">
                <strong>Your BMI:</strong> {bmi.toFixed(2)} ({category})
              </div>
              <div className="progress" style={{ height: '25px' }}>
                <div
                  className="progress-bar progress-bar-striped progress-bar-animated"
                  role="progressbar"
                  style={{
                    width: `${Math.min(bmi, 40) * 2.5}%`,
                    background: 'linear-gradient(90deg, #43cea2, #185a9d)'
                  }}
                  aria-valuenow={bmi}
                  aria-valuemin="0"
                  aria-valuemax="40"
                >
                  {bmi.toFixed(2)}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="card mt-4 shadow p-4 fade-in" style={{ backgroundColor: '#f9fbe7' }}>
          <h4 className="mb-3" style={{ color: '#558B2F' }}>
            <FaHistory /> Your BMI History
          </h4>
          {history.length === 0 ? (
            <p className="text-muted">No history yet.</p>
          ) : (
            <ul className="list-group">
              {history.map((record) => (
                <li key={record._id} className="list-group-item">
                  <strong>Weight:</strong> {record.weight}kg | <strong>Height:</strong> {record.height}cm | <strong>BMI:</strong> {record.bmi.toFixed(2)} ({record.category}) | <strong>Date:</strong> {new Date(record.date).toLocaleString()}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <footer className="text-center mt-5 mb-3 text-muted">
        &copy; {new Date().getFullYear()} BMI Calculator | Designed with ❤️ and Colors
      </footer>

      {/* Fade-in animation */}
      <style>{`
        .fade-in {
          animation: fadeIn 0.8s ease-in forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .list-group-item:hover {
          background-color: #e0f2f1;
          cursor: pointer;
        }
      `}</style>
    </>
  );
}

export default App;

