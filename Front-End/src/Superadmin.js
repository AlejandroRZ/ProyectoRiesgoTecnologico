import React from 'react';
import './Superadmin.css';
import { useNavigate } from 'react-router-dom';
import { FormGroup, Button } from 'reactstrap';
import CRUDAdmin from './CRUDAdmin';
import Login from './Login';
import UserMenu from './UserMenu';
import DancingCat from './DancingCat';

// Función para cerrar sesión.
// Limpia el almacenamiento local y redirige al usuario a la página de inicio.
function Superadmin() {
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

    // Verifica si no hay una sesión activa.
    // Si no existe una sesión, redirige al componente de inicio de sesión.
    if (!localStorage.getItem('tipo_usuario')) {
        return <Login />
    }

    // Verifica si el usuario no tiene permisos para la vista de superadministrador.
    // Si el tipo de usuario no es "superadmin", muestra un mensaje de acceso denegado.
    if (localStorage.getItem('tipo_usuario') !== 'superadmin') {
        return (
            <div className="error-container">
                <DancingCat />
                <p style={{ fontSize: '24px', textAlign: 'center', fontFamily: 'Georgia, serif' }}>
                    No tienes permisos para ver esta página
                </p>
                <FormGroup className="text-center">
                    <Button color="primary" onClick={handleVolver}>
                        Volver
                    </Button>
                </FormGroup>
            </div>
        );
    }

    //Devuelve el componente principal//
    return (
        <div className='SuperAdmin'>
            <h1>¡Hola, superadministrador!</h1>
            <UserMenu handleLogout={handleLogout} />
            <CRUDAdmin />
        </div>
    );
}

export default Superadmin;
