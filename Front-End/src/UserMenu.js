import { useNavigate } from "react-router-dom"

import { useState } from "react";
import "./UserMenu.css";

function UserMenu({ handleLogout, buttonEdit = false }) {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    function handleOpen(){
        setOpen( value => !value );
    }

    function handleEdit(){
        navigate("/editarPerfil");
    }

    function handleVer(){
        navigate("/verPerfil");
    }

    return <div className="container">

        <button className="buttonUserMenu" onClick={handleOpen}> {
            !open ? 
            <span>&equiv;</span> :
            <span>&times;</span>
        } </button>

        {!open ? null : 
        <>

        {buttonEdit ?
        <>
        <button onClick={handleVer}> Ver Perfil </button> 
        <button onClick={handleEdit}> Editar Perfil </button>
        </>:
        null
        }
        <button onClick={handleLogout}> Cerrar Sesión </button>
        </>
        }
    </div>
}

export default UserMenu;