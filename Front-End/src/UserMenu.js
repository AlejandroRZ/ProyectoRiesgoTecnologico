import { useNavigate } from "react-router-dom"

import { useState } from "react";
import "./UserMenu.css";
import React from 'react';

// Componente UserMenu.
// Representa un menú de usuario desplegable que incluye opciones como editar perfil, ver perfil y cerrar sesión.
function UserMenu({ handleLogout, buttonEdit = false }) {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    
    // Maneja la apertura y cierre del menú al hacer clic en el botón del menú
    function handleOpen(){
        setOpen( value => !value );
    }

    // Navega a la página de edición del perfil
    function handleEdit(){
        navigate("/editarPerfil");
    }

    // Navega a la página de visualización del perfil
    function handleVer(){
        navigate("/verPerfil");
    }

    //Renderiza el componente principal
    return (
        <div className="container">
            <button className="buttonUserMenu" onClick={handleOpen}>
                {!open ? <span>&equiv;</span> : <span>&times;</span>}
            </button>
    
            {!open ? null : (
                <div className="user-menu-container">
                    {buttonEdit && (
                        <>
                            <button className="user-menu-button" onClick={handleVer}>
                                Ver Perfil
                            </button>
                            <button className="user-menu-button" onClick={handleEdit}>
                                Editar Perfil
                            </button>
                        </>
                    )}
                    <button className="user-menu-button" onClick={handleLogout}>
                        Cerrar Sesión
                    </button>
                </div>
            )}
        </div>
    );
    
}
export default UserMenu;