import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./VerPerfil.css"
import React from 'react';


// Componente VerPerfil
// Muestra la información del perfil del usuario, como nombre, correo, y gamertag,
// obtenida del almacenamiento local, además de proporcionar un botón para regresar a la vista de participante.
function VerPerfil(){
    // Estado local para almacenar los datos del perfil, inicializado con valores obtenidos del almacenamiento local.
    const [perfilData, setPerfilData] = useState({
        noCuenta: localStorage.getItem('noCuenta'),
        nombre: localStorage.getItem('nombre'),
        apellido: localStorage.getItem('apellido'),
        correo: localStorage.getItem('email'),
        contrasena: ''
      });
    
    const navigate = useNavigate();
    
    // Función para regresar a la vista del participante
    function handleRegresar(){
        navigate("/participante");
    }

    return <div className="containerVerPerfil">
        <h1>¡Hola, {perfilData.nombre}!</h1>
        <p>{perfilData.correo}</p>
        <h3>{perfilData.gamertag}</h3>

        <img src="merkaditaFC.png" alt="logo"/>

        <button className="buttonVerPerfil" onClick={handleRegresar}>Regresar a vista de participante</button>
    </div>
}

export default VerPerfil;