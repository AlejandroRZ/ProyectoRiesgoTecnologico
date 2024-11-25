import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import BottomBar from './BottomBar';
import Participante from './Participante';
import Administrador from './Administrador';
import Superadmin from './Superadmin';
import VistaStand from './VistaStand';
import EditProfile from './EditProfile';
import VerPerfil from './VerPerfil';
import CRUDParticipantes from './CRUDParticipantes';
import './App.css';

// Componente principal de la aplicación React.
function App() {
  // Hook de React Router que proporciona información sobre la ubicación actual de la página.
  const location = useLocation();

  // Detectar si la ruta actual es login o registro
  const isAuthRoute = location.pathname === '/' || location.pathname === '/registrar';
  const isTopBar = location.pathname === '/' || location.pathname === '/registrar';

  // Renderizado principal de la aplicación.
  return (
    <div className={isAuthRoute ? "App auth-page" : "App animated-background"}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="*" element={<>NOT FOUND</>} />
        <Route path="registrar" element={<Register />} />
        <Route path="participante" element={<Participante />} />
        <Route path="administrador" element={<Administrador />} />
        <Route path="superadmin" element={<Superadmin />} />
        <Route path="vistaStand" element={<VistaStand />} />
        <Route path="editarPerfil" element={<EditProfile />} />
        <Route path="verPerfil" element={<VerPerfil />} />
        <Route path="CRUDParticipantes" element={<CRUDParticipantes />} />
      </Routes>
      <BottomBar isTopBar={isTopBar} />
    </div>
  );
}

export default App;

