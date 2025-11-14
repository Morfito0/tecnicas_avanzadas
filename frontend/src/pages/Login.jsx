import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false); // 🔥 Nuevo: Mostrar/ocultar contraseña

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="auth-page fade-in">
      <div className="auth-container">
        <h1>🎬 Iniciar Sesión</h1>
        <form onSubmit={handleSubmit} className="auth-form">
          
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="tu@email.com"
            />
          </div>

          {/* 🔥 Campo de contraseña mejorado */}
          <div className="form-group password-input">
            <label>Contraseña</label>
            <div className="password-wrapper">
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
              <span
                className="toggle-pass"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? '🙈' : '👁️'}
              </span>
            </div>
          </div>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>

          {/* 🔥 Login de prueba rápido */}
          <button
            type="button"
            className="test-btn"
            onClick={() => {
              setEmail('demo@demo.com');
              setPassword('123456');
            }}
          >
            ⚡ Usar Cuenta de Prueba
          </button>

          <p className="forgot-link">
            ¿Olvidaste tu contraseña? <Link to="/recover">Recupérala aquí</Link>
          </p>

          <p className="auth-link">
            ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
