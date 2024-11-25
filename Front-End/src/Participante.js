import React from 'react';
import { Button, FormGroup } from 'reactstrap';
import './Participante.css';
import { useNavigate } from 'react-router-dom';
import VistaStandEnParticipante from './VistaStandEnParticipante';
import Login from './Login';
import DancingCat from './DancingCat';
import UserMenu from './UserMenu';

// Componente principal para la vista del participante.
// Verifica los permisos del usuario y proporciona opciones específicas para los participantes.
function Participante() {
    const navigate = useNavigate();

    // Función para cerrar sesión.
    // Limpia el almacenamiento local y redirige al usuario a la página de inicio.
    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };   

    // Volver a la vista anterior
    const handleVolver = () => {
        navigate(-1); 
    };

    // Verifica si el usuario no tiene una sesión activa.
    // Si no hay una sesión, redirige al componente de inicio de sesión.
    if (!localStorage.getItem('tipo_usuario')) {
        return <Login />
    }

    // Verifica si el usuario no tiene permisos para la vista de participante.
    // Si el tipo de usuario no es "participante", muestra un mensaje de acceso denegado.
    if (localStorage.getItem('tipo_usuario') !== 'participante') {
        return (
          <div>
            <DancingCat />
            <p style={{ fontSize: '24px', textAlign: 'center', fontFamily: 'Georgia, serif' }}>
              No tienes permisos para ver esta página
            </p>
            <FormGroup className="text-center">
          <Button style={{ width: '200px' }} color="primary" onClick={handleVolver}>
            Volver
          </Button>
        </FormGroup>
          </div>
        );
    }

    //Render del componente principal
    return (
      <div className="Participante">
       <h1>¡Hola, participante!</h1>
       <UserMenu handleLogout={handleLogout} buttonEdit={true}/>
        Estos son los stands disponibles:
        <VistaStandEnParticipante/>
      </div>
    );
}

export default Participante;