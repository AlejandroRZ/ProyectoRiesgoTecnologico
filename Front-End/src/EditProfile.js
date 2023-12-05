import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap';
import './EditProfile.css';
import Login from './Login';
import DancingCat from './DancingCat';

function EditProfile() { 

  const [formData, setFormData] = useState({
    idParticipante: '',
    nombre: localStorage.getItem('nombre'),
    apellido: localStorage.getItem('apellido'),
    correo: localStorage.getItem('email'),
    contrasena: '',
    gamertag: localStorage.getItem('gamertag'),
    foto: null,
  });
  
  const [modal, setModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [contrasenaEliminar, setContrasenaEliminar] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [errors, setErrors] = useState({});
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [intentosFallidos, setIntentosFallidos] = useState(0);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const navigate = useNavigate();

  const toggleModal = () => setModal(!modal);
  const toggleDeleteModal = () => setDeleteModal(!deleteModal);

  useEffect(() => {
    // Obtener el ID del localStorage
    const idParticipante = localStorage.getItem('id');
    setFormData({ ...formData, idParticipante });
  }, []);

  
  const handleVolver = () => {
    navigate(-1); // Volver a la vista anterior
  };

  if (!localStorage.getItem('tipo_usuario')) {
    return <Login />
  }

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

  const datosValidos = () => {
    let errors = {};
    let isValid = true;

    // Validación del correo
    if(formData.correo){
      if (typeof formData.correo !== "undefined") {
        let lastAtPos = formData.correo.lastIndexOf('@');
        let lastDotPos = formData.correo.lastIndexOf('.');

        if (!(lastAtPos < lastDotPos && lastAtPos > 0 && formData.correo.indexOf('@@') === -1 && lastDotPos > 2 && (formData.correo.length - lastDotPos) > 2)) {
          isValid = false;
          errors["correo"] = "Correo inválido.";
        }
      }
    }      
    
    // Validación de la contraseña
    if(formData.contrasena){
      if (formData.contrasena.length < 8) {
        isValid = false;
        errors["contrasena"] = "La contraseña debe tener al menos 8 caracteres.";
      }
    }

     // Validación del gamertag
    if (formData.gamertag) {
      const regex = /^[a-zA-Z0-9]+$/; // Expresión regular para alfanuméricos sin caracteres especiales
      const startsWithAt = formData.gamertag.startsWith('@');
      const lengthValid = formData.gamertag.length >= 5;
      const containsOnlyAlphanumeric = regex.test(formData.gamertag.slice(1));

      if (!(startsWithAt && lengthValid && containsOnlyAlphanumeric)) {
        isValid = false;
        errors["gamertag"] = "Gamertag inválido. Debe comenzar con '@' y tener al menos 5 caracteres alfanuméricos.";
      }          
    } 

    setErrors(errors);
    return isValid;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      foto: file,
    });
  };

  const handleGuardarCambios = async (e) => {
    e.preventDefault();
    if (!datosValidos()) {
      return;
    }
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
      if (data.message === 'Perfil actualizado exitosamente') {       
         // Verificar que los campos no estén vacíos
        if (formData.nombre) {
          localStorage.setItem('nombre', formData.nombre);
        }
        if (formData.apellido) {
          localStorage.setItem('apellido', formData.apellido);
        }

        if (formData.correo) {
          localStorage.setItem('email', formData.correo);
        }

        if (formData.contrasena) {
          localStorage.setItem('contrasena', formData.contrasena);
        }

        if (formData.gamertag) {
          localStorage.setItem('gamertag', formData.gamertag);
        }

        if (formData.foto) {
          localStorage.setItem('foto', formData.foto);
        }
        openSuccessModal();  
      } else if (data.error === 'Error, correo asociado a otra cuenta. Puede estar asociado a una cuenta no apta para participar.') {
        setErrors({correo: data.error });
      } else if (data.error === 'Error, tag ya asignado'){
        setErrors({gamertag: data.error});
      } else if (data.error) {
        // Mostrar el error en el modal
        setErrorMessage(data.error);
        setIsErrorModalOpen(true);
      }
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        // Error de conexión rechazada (servidor no disponible)
        console.error('Error: El servidor no está disponible');
        // Mostrar el error en el modal
        setErrorMessage('Error: El servidor no está disponible, intenta más tarde');
        setIsErrorModalOpen(true);
      } else {
        // Otro tipo de error
        console.error('Error al enviar datos al servidor:', error);
        // Mostrar el error en el modal
        setErrorMessage('Error en el servidor, intenta más tarde');
        setIsErrorModalOpen(true);
      }
    }    
  };

  const handleEliminarPerfil = () => {
    toggleDeleteModal();
    setDeleteError('');
  };
  

  const handleConfirmarEliminar = async () => {
    try {
      if (!contrasenaEliminar) {
        setDeleteError('Ingresa tu contraseña');
        return;
      }
      // Lógica para eliminar el perfil en el servidor
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
  
      // Validar la respuesta del servidor
      if (data.message === 'Perfil eliminado exitosamente') {
        // Cerrar sesión y redirigir a la página de inicio
        localStorage.clear();
        navigate('/');
      } else if (data.error === 'Contraseña incorrecta') {
        // Aumentar el contador de intentos fallidos
        setIntentosFallidos(intentosFallidos + 1);
         // Mostrar el mensaje de error en el modal
        if (intentosFallidos < 2) {
          setDeleteError(`Contraseña incorrecta. Intentos restantes: ${2 - intentosFallidos}`);
        } else {
          setDeleteError('Demasiados intentos fallidos. Se cerrará la sesión.');
        // Aquí puedes agregar la lógica para cerrar la sesión después de tres intentos fallidos
          setTimeout(() => {
          // Cerrar sesión y redirigir a la página de inicio
            localStorage.clear();
            navigate('/');
          }, 3000);
        }       
      } else {      
            // Actualizar el estado con el mensaje de error en caso de error de red
        setDeleteError('Error de red, inténtalo de nuevo');
      }
    } catch (error) {
      console.error('Error al enviar datos al servidor:', error);
    }
  };

  const handleCloseModal = () => {
    setIsErrorModalOpen(false);
  };

  const handleClickVolver = () => {
    navigate('/participante'); // Navegar hacia atrás
  };

  const openSuccessModal = () => {
    setSuccessModalOpen(true);
  };

  return (
    <div className="EditProfile">
      <h1>Editar perfil</h1>
      <form onSubmit={handleGuardarCambios}>    
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <FormGroup>
          <Label for="nombre">Nombre:</Label>
          <Input
            type="text"
            id="nombre"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} 
            style={{ width: '300px' }}           
          />
          {errors.nombre&& <div className="alert alert-danger">{errors.nombre}</div>}
        </FormGroup>

        <FormGroup>
          <Label for="apellido">Apellido:</Label>
          <Input
            type="text"
            id="apellido"
            value={formData.apellido}
            onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
            style={{ width: '300px' }}          
          />
          {errors.apellido&& <div className="alert alert-danger">{errors.apellido}</div>}
        </FormGroup>

        <FormGroup>
          <Label for="correo">Correo:</Label>
          <Input
            type="email"
            id="correo"
            value={formData.correo}
            onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
            style={{ width: '300px' }}           
          />
          {errors.correo&& <div className="alert alert-danger">{errors.correo}</div>}
        </FormGroup>

        <FormGroup>
          <Label for="contrasena">Contraseña:</Label>
          <Input
            type="password"
            id="contrasena"
            value={formData.contrasena}
            onChange={(e) => setFormData({ ...formData, contrasena: e.target.value })} 
            style={{ width: '300px' }}           
          />
          {errors.contrasena&& <div className="alert alert-danger">{errors.contrasena}</div>}
        </FormGroup>       

        <FormGroup>
          <Label for="gamertag">Gamertag:</Label>
          <Input
            type="text"
            id="gamertag"
            value={formData.gamertag}
            onChange={(e) => setFormData({ ...formData, gamertag: e.target.value })}
            style={{ width: '300px' }}              
          />
          {errors.gamertag&& <div className="alert alert-danger">{errors.gamertag}</div>}
        </FormGroup>

        <FormGroup className="d-flex flex-column align-items-center">
            <Label for="foto">Foto de perfil:</Label>      
            {/* Botón para abrir el explorador de archivos */}
            <Button style={{ width: '200px' }} color="primary" onClick={toggleModal}>
            Seleccionar foto
            </Button>
        </FormGroup>
      </div>      
     
        <FormGroup className="mb-3 text-center">
            <Button style={{ width: '200px' }} color="primary" type="submit" className="mr-2">
             Guardar cambios
            </Button>
        </FormGroup> 
        <FormGroup className="mb-3 text-center">
            <Button style={{ width: '200px' }} color="primary" onClick={handleClickVolver}>
             Volver a la vista de participante
            </Button>
          </FormGroup>
        <FormGroup className="mb-3 text-center">
            <Button style={{ width: '200px', backgroundColor: '#F05E16', borderColor: '#F05E16', 
            transition: 'background-color 0.3s ease'}}  
            onClick={handleEliminarPerfil} onMouseOver={(e) => e.target.style.backgroundColor = '#B05625'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#F05E16'}>
            Eliminar perfil
          </Button>
        </FormGroup>  
        <FormGroup className="mb-3 text-center">
            <Button style={{ width: '200px', backgroundColor: '#F05E16', borderColor: '#F05E16', 
            transition: 'background-color 0.3s ease' }} 
             onClick={handleEliminarPerfil} onMouseOver={(e) => e.target.style.backgroundColor = '#B05625'}
             onMouseOut={(e) => e.target.style.backgroundColor = '#F05E16'}>
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
          <Button style={{ width: '150px' }} color="primary" onClick={toggleModal}>
            Confirmar
          </Button>{' '}
          <Button style={{ width: '150px' }} color="secondary" onClick={toggleModal}>
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={deleteModal} toggle={toggleDeleteModal}>
        <ModalHeader toggle={toggleDeleteModal}>Confirmar eliminación</ModalHeader>
        <ModalBody>
          <p>¿Estás seguro de que deseas eliminar tu perfil?</p>
          <Form>
            <FormGroup className="d-flex flex-column align-items-center">
              <Label for="contrasenaEliminar">Ingresa tu contraseña:</Label>
              <Input
                type="password"
                id="contrasenaEliminar"
                value={contrasenaEliminar}
                onChange={(e) => setContrasenaEliminar(e.target.value)}
                style={{ width: '300px' }}
                required
              />
            </FormGroup>
          </Form>
          {deleteError && <div className="alert alert-danger">{deleteError}</div>}
        </ModalBody>
        <ModalFooter>
          <Button style={{ width: '150px', backgroundColor: '#F05E16', borderColor: '#F05E16', 
            transition: 'background-color 0.3s ease' }} onClick={handleConfirmarEliminar} onMouseOver={(e) => e.target.style.backgroundColor = '#B05625'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#F05E16'}>
            Eliminar
          </Button>{' '}
          <Button style={{ width: '150px' }} color="secondary" onClick={toggleDeleteModal}>
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={successModalOpen} toggle={() => setSuccessModalOpen(false)}>
      <ModalHeader toggle={() => setSuccessModalOpen(false)}>Éxito</ModalHeader>
        <ModalBody>
          <p>Los datos han sido actualizados correctamente.</p>
        </ModalBody>
      <ModalFooter>
          <Button style={{ width: '150px' }} color="primary" onClick={() => setSuccessModalOpen(false)}>
            Cerrar
          </Button>
      </ModalFooter>
      </Modal>

      {isErrorModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseModal}>&times;</span>
            <p>{errorMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditProfile;