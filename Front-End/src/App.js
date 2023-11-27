import React from 'react';
import {Route, Routes} from 'react-router-dom';
import Login from "./Login";
import Register from "./Register";
import BottomBar from "./BottomBar";
import Participante from "./Participante";
import Administrador from './Administrador';
import Superadmin from './Superadmin';
import VistaTorneos from './VistaTorneos';
import EditProfile from './EditProfile';
import "./App.css";



function App() {
  return (  
    <div className = "App">         
        <Routes>
            <Route path="/" element={<Login />} />  
            <Route path="*" element={<>NOT FOUND</>} />          
            <Route path="registrar" element={<Register />} /> 
            <Route path="participante" element={<Participante />} />
            <Route path="administrador" element={<Administrador />} />
            <Route path="superadmin" element={<Superadmin />} />
            <Route path="vistaTorneos" element={<VistaTorneos/>} />
            <Route path="editarPerfil" element={<EditProfile/>} />
        </Routes> 
        <BottomBar />      
    </div>  
  );
}

export default App;