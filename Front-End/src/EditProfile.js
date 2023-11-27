import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap';
import './EditProfile.css';

function EditProfile() {
  const [formData, setFormData] = useState({
    idParticipante: '',
    nombre: '',
    apellido: '',
    correo: '',
    contrasena: '',
    gamertag: '',
    foto: null,
  });

  const [modal, setModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [contrasenaEliminar, setContrasenaEliminar] = useState('');
  const navigate = useNavigate();

  const toggleModal = () => setModal(!modal);
  const toggleDeleteModal = () => setDeleteModal(!deleteModal);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      foto: file,
    });
  };

  const handleGuardarCambios = async (e) => {
    e.preventDefault();

    console.log('Datos actualizados:', formData);
    
    try {
      const res = await fetch(`http://127.0.0.1:5000/participante/editarPerfil`, {
        method: 'PUT',
        headers: {            
            'Content-Type': 'application/json',
        },
          body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log('Respuesta del servidor:', data);
      //toggleModal();
    } catch (error) {
      console.error('Error al enviar datos al servidor:', error);     
    }
  };

  const handleEliminarPerfil = () => {
    toggleDeleteModal();
  };

  const handleConfirmarEliminar = async () => {
    // Lógica para eliminar el perfil en el servidor
    try {
      const res = await fetch(`http://127.0.0.1:5000/participante/eliminarPerfil`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idParticipante: formData.idParticipante,
          contrasenaEliminar: contrasenaEliminar,
        }),
      });
  
      const data = await res.json();
      console.log('Respuesta del servidor:', data); 
      
  
      // Cerrar el modal después de realizar la acción
      toggleDeleteModal();
    } catch (error) {
      console.error('Error al enviar datos al servidor:', error);      
    }
  };

  const handleClickVolver = () => {
    navigate(-1); // Navegar hacia atrás
  };

  return (
    <div className="EditProfile">
      <h1>Editar perfil</h1>
      <form onSubmit={handleGuardarCambios}>

      <FormGroup>
          <Label for="idParticipante">ID participante:</Label>
          <Input
            type="number"
            id="idParticipante"
            value={formData.idParticipante}
            onChange={(e) => setFormData({ ...formData, idParticipante: e.target.value })}          
          />
        </FormGroup>

        <FormGroup>
          <Label for="nombre">Nombre:</Label>
          <Input
            type="text"
            id="nombre"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}            
          />
        </FormGroup>

        <FormGroup>
          <Label for="apellido">Apellido:</Label>
          <Input
            type="text"
            id="apellido"
            value={formData.apellido}
            onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}          
          />
        </FormGroup>

        <FormGroup>
          <Label for="correo">Correo:</Label>
          <Input
            type="email"
            id="correo"
            value={formData.correo}
            onChange={(e) => setFormData({ ...formData, correo: e.target.value })}           
          />
        </FormGroup>

        <FormGroup>
          <Label for="contrasena">Contraseña:</Label>
          <Input
            type="password"
            id="contrasena"
            value={formData.contrasena}
            onChange={(e) => setFormData({ ...formData, contrasena: e.target.value })}            
          />
        </FormGroup>
        

        <FormGroup>
          <Label for="gamertag">Gamertag:</Label>
          <Input
            type="text"
            id="gamertag"
            value={formData.gamertag}
            onChange={(e) => setFormData({ ...formData, gamertag: e.target.value })}            
          />
        </FormGroup>

        <FormGroup className="d-flex flex-column align-items-center">
            <Label for="foto">Foto de perfil:</Label>      
            {/* Botón para abrir el explorador de archivos */}
            <Button color="primary" onClick={toggleModal}>
            Seleccionar foto
            </Button>
        </FormGroup>

        <FormGroup className="mb-3 text-center">
            <Button color="primary" type="submit" className="mr-2">
             Guardar cambios
            </Button>
            <Button color="primary" onClick={handleClickVolver}>
             Volver
            </Button>
            <Button color="danger" onClick={handleEliminarPerfil}>
            Eliminar perfil
          </Button>
        </FormGroup>        

        <FormGroup className="mb-3 text-center"> 
          <Button color="danger" onClick={handleEliminarPerfil}>
            Eliminar perfil
          </Button>        
        </FormGroup>
      </form>

      {/* Modal para la selección de foto */}
      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Seleccionar foto</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="fotoModal">Foto</Label>
              <Input type="file" id="fotoModal" onChange={handleFileChange} />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={toggleModal}>
            Confirmar
          </Button>{' '}
          <Button color="secondary" onClick={toggleModal}>
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={deleteModal} toggle={toggleDeleteModal}>
        <ModalHeader toggle={toggleDeleteModal}>Confirmar eliminación</ModalHeader>
        <ModalBody>
          <p>¿Estás seguro de que deseas eliminar tu perfil?</p>
          <Form>
            <FormGroup>
              <Label for="contrasenaEliminar">Ingresa tu contraseña:</Label>
              <Input
                type="password"
                id="contrasenaEliminar"
                value={contrasenaEliminar}
                onChange={(e) => setContrasenaEliminar(e.target.value)}
                required
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={handleConfirmarEliminar}>
            Eliminar
          </Button>{' '}
          <Button color="secondary" onClick={toggleDeleteModal}>
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default EditProfile;