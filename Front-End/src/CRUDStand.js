//import React from "react";
import React from "react";
import "./CRUDStand.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Table, Button, Container, Modal, ModalHeader, ModalBody, FormGroup, ModalFooter, Input} from "reactstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";


class CRUDStand extends React.Component {
  state = {
    data: [],
    dataFiltrada: [],
    modalActualizar: false,
    modalInsertar: false,
    modalEliminar: false,
    standAEliminar: "",
    formInsertar: {
      nombre: "",
      ubicacion: "",      
      fechahora: new Date(),
      estado: ""
    },
    formActualizar: {
      noStand: "",
      nombre: "",
      ubicacion: "",
      fechahora: new Date(),
      estado: "",
      previousDate: new Date()
    },
    busqueda: "",
    errorsInsertar: {},
    errorsActualizar: {},
  };

  // Obtiene la lista de stands del servidor al montar el componente.
  componentDidMount() {
    fetch("http://127.0.0.1:5000/stand/readstands")
      .then((response) => response.json())
      .then((data) => {
        this.setState({ data: data, dataFiltrada: data });
      })
      .catch((error) => {
        alert("Error al obtener datos del servidor:", error);
      });
  }

  // Realiza la redirección a la vista de stands
  mostrarTodosStands = () => {
    window.location.href = "http://localhost:3000/vistaStand";    
  };

  // Realiza la redirección al CRUD de participantes
  CRUDParticipantes = () => {    
    window.location.href = "http://localhost:3000/CRUDParticipantes";    
  };

  // Función para mostrar el modal de actualización de stand con los datos pasados como argumento 
  mostrarModalActualizar = (dato) => {
    const fechaFormateada = new Date(dato.fechahora);
    const { noStand, nombre, ubicacion, fechahora, estado, noCuentaAdmin } = dato;
    this.setState({
      formActualizar: {
        noStand,
        nombre,
        ubicacion,
        fechahora: fechaFormateada,
        estado,
        noCuentaAdmin,
        previousDate: dato.fechahora
      },
      modalActualizar: true,
    });
  };

  // Función para mostrar el modal de inserción para un neuvo participante
  mostrarModalInsertar = () => {
    this.setState({
      modalInsertar: true,
    });
  };

   // Función para cerrar el modal de actualización y limpiar los errores
   cerrarModalActualizar = () => {   
    this.setState({ modalActualizar: false });
    this.setState({errorsActualizar: {}});
  };

  // Función para cerrar el modal de inserción y limpiar los errores
  cerrarModalInsertar = () => {
    this.setState({ modalInsertar: false });
    this.setState({errorsInsertar: {}});
  };

  // Función para mostrar el modal de eliminación con los datos del participante a eliminar
  mostrarModalEliminar = (dato) => {
    this.setState({
      modalEliminar: true,
      standAEliminar: dato.noStand,
    });
  };

  // Función para cerrar el modal de eliminación
  cerrarModalEliminar = () => {
    this.setState({ modalEliminar: false });
  };

  // Inserta un nuevo stand dentro de la tabla correspondiente
  insertar = async () => {
    if(!this.datosValidosInsertar()){return;}
    const { nombre, ubicacion, fechahora, estado } = this.state.formInsertar;
    /*const fechaFormateada = fechahora.toISOString().slice(0, 19); */
    const fechaFormateada = moment(fechahora).format("YYYY-MM-DDTHH:mm:ss");   
    try{
      const response = await fetch("http://127.0.0.1:5000/stand/insertstand", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre, ubicacion, fechaHora: fechaFormateada, estado, noCuentaAdmin: localStorage.getItem('noCuenta') }),
      });

      const data = await response.json();
  
      if (response.ok && data.message === "Stand insertado correctamente") {
        // Registro exitoso
        this.componentDidMount(); // Recargar datos
        this.cerrarModalInsertar(); // Cerrar modal
      } else {
        // Manejar errores de la respuesta
        const errorsInsertar = {};
  
        if (data.error === "Error, ubicación ocupada por otro stand.") {
          errorsInsertar["ubicacion"] = "La ubicación ya está asociada a otro stand.";
        } else if (data.error === "Error, nombre ocupado por otro stand.") {
          errorsInsertar["nombre"] = "Error, nombre ocupado por otro stand.";
        } else {
          errorsInsertar["general"] = "Error desconocido. Por favor, inténtalo nuevamente.";
        }  
        // Actualizar estado con los errores
        this.setState({ errorsInsertar });
        return; // Detener ejecución
      }
    } catch (error) {
      console.error("Error al insertar stand:", error);
      this.setState({
        errorsInsertar: {
          general: "Error de conexión. Por favor, inténtalo más tarde.",
        },
      });
    }
  };

  // Actualiza la información de un stand después de validar los datos.
  editar = async () => {
    if(!this.datosValidosEditar()){return;}
    const { noStand, nombre, ubicacion, fechahora, estado, noCuentaAdmin } = this.state.formActualizar;
    /*const fechaFormateada = fechahora.toISOString().slice(0, 19);*/
    const fechaFormateada = moment(fechahora).format("YYYY-MM-DDTHH:mm:ss");
    try{
      const response = await fetch("http://127.0.0.1:5000/stand/updatestand", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ noStand, nombre, ubicacion, fechahora: fechaFormateada, estado, noCuentaAdmin }),
      });

      const data = await response.json();
  
      if (response.ok && data.message === "Stand editado correctamente") {
        // Registro exitoso
        this.componentDidMount(); // Recargar datos
        this.cerrarModalActualizar(); // Cerrar modal
      } else {
        // Manejar errores de la respuesta
        const errorsActualizar = {};
  
        if (data.error === "Error, ubicación ocupada por otro stand.") {
          errorsActualizar["ubicacion"] = "La ubicación ya está asociada a otro stand.";
        } else if (data.error === "Error, nombre ocupado por otro stand.") {
          errorsActualizar["nombre"] = "Error, nombre ocupado por otro stand.";
        } else {
          errorsActualizar["general"] = "Error desconocido. Por favor, inténtalo nuevamente.";
        }  
        // Actualizar estado con los errores
        this.setState({ errorsActualizar });
        return; // Detener ejecución
      }

    } catch (error) {
      console.error("Error al insertar stand:", error);
      this.setState({
        errorsActualizar: {
          general: "Error de conexión. Por favor, inténtalo más tarde.",
        },
      });
    }
  };

  // Elimina un stand después de confirmar la acción.
  eliminar = (dato) => {
    fetch("http://127.0.0.1:5000/stand/deletestand", {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ noStand: dato.noStand }),
    })
      .then(response => response.json())
      .then(data => {        
        if (data.message) {
          this.componentDidMount();
          this.setState({ modalEliminar: false, standAEliminar: null });
        } else {
          alert('Error al eliminar stand en el servidor: ' + data.error);
        }
      })
      .catch(error => {
        console.error("Error al eliminar stand:", error);
        alert("Error al eliminar stand. Por favor, inténtalo más tarde.");
      });
  };
  
  // Válida los datos del nuevo stand a añadir
  datosValidosInsertar = () => {
    let errorsInsertar = {};
    let isValid = true;  

    if(!this.state.formInsertar.nombre){
      isValid = false;
      errorsInsertar["nombre"] = "Por favor, ingresa un nombre.";
    }else{
      if (this.state.formInsertar.nombre.length < 3){
        isValid = false;
        errorsInsertar["nombre"] = "El nombre debe de tener al menos 3 carácteres.";
      }
    }

    if(!this.state.formInsertar.ubicacion){
      isValid = false;
      errorsInsertar["ubicacion"] = "Por favor, ingresa la ubicación.";
    }else{
      if (this.state.formInsertar.ubicacion.length < 10){
        isValid = false;
        errorsInsertar["ubicacion"] = "La ubicacion debe de tener al menos 10 carácteres.";
      }
    }    

    if(this.state.formInsertar.estado === ""){
      isValid = false;
      errorsInsertar["estado"] = "Por favor, ingresa un estado.";
    }
    // Verificación de la fecha y hora
    const now = new Date(); // Fecha y hora actual
    const tenMinutesLater = new Date(now.getTime() + 10 * 60 * 1000); // 10 minutos después de la fecha actual
    const selectedDate = this.state.formInsertar.fechahora;
    
    if (!selectedDate) {
      isValid = false;
      errorsInsertar["fechahora"] = "Por favor, selecciona una fecha y hora.";
    } else if (selectedDate < tenMinutesLater) {
      // Verificación de que sea al menos 10 minutos en el futuro
      isValid = false;
      errorsInsertar["fechahora"] = "La fecha y hora deben ser al menos 10 minutos posteriores a la hora actual.";
    }   
    this.setState({ errorsInsertar });
    return isValid;
  }

  //Válida los nuevos datos por asignar al stand seleccionado
  datosValidosEditar = () => {
    let errorsActualizar = {};
    let isValid = true;  

    if(!this.state.formActualizar.nombre){
      isValid = false;
      errorsActualizar["nombre"] = "Por favor, ingresa un nombre.";
    }else{
      if (this.state.formActualizar.nombre.length < 3){
        isValid = false;
        errorsActualizar["nombre"] = "El nombre debe de tener al menos 3 carácteres.";
      }
    }

    if(!this.state.formActualizar.ubicacion){
      isValid = false;
      errorsActualizar["ubicacion"] = "Por favor, ingresa la ubicación.";
    }else{
      if (this.state.formActualizar.ubicacion.length < 10){
        isValid = false;
        errorsActualizar["ubicacion"] = "La ubicacion debe de tener al menos 10 carácteres.";
      }
    }    

    if(this.state.formActualizar.estado === ""){
      isValid = false;
      errorsActualizar["estado"] = "Por favor, ingresa un estado.";
    }
    // Verificación de la fecha y hora   
    const selectedDate = this.state.formActualizar.fechahora; // Fecha y hora original guardada
    const now = new Date();
    const tenMinutesLater = new Date(now.getTime() + 10 * 60 * 1000);
    const previousDate = this.state.formActualizar.fechahora;
    if(selectedDate !== previousDate){      
      if (!selectedDate) {
        isValid = false;
        errorsActualizar["fechahora"] = "Por favor, selecciona una fecha y hora.";
      } else if (selectedDate < tenMinutesLater) {
        // Verificación de que sea al menos 10 minutos en el futuro
        isValid = false;
        errorsActualizar["fechahora"] = "La fecha y hora deben ser al menos 10 minutos posteriores a la hora actual.";
      }
    }   
    this.setState({ errorsActualizar });
    return isValid;
    
  }

  // Maneja los cambios en los campos de texto para el formulario de inserción.
  handleChangeInsertar = (e) => {
    this.setState({
      formInsertar: {
        ...this.state.formInsertar,
        [e.target.name]: e.target.value,
      },
    });
  };

  // Maneja los cambios en el campo de la fecha para el formulario de inserción.
  handleChangeFechaHoraInsertar = (date) => {
    this.setState((prevState) => ({
      formInsertar: {
        ...prevState.formInsertar,
        fechahora: date,
      },
    }));
  };

  // Maneja los cambios en el campo de estado para el formulario de inserción.
  handleChangeEstadoInsertar = (e) => {
    const estado = e.target.value === "true"; // Convertir el valor a booleano
    this.setState({
      formInsertar: {
        ...this.state.formInsertar,
        estado,
      },
    });
  };

  // Maneja los cambios en el campo de la fecha para el formulario de actualización.
  handleChangeFechaHoraActualizar = (date) => {
    this.setState((prevState) => ({
      formActualizar: {
        ...prevState.formActualizar,
        fechahora:date, // Ajusta según tus necesidades
      },
    }));
  };

  // Maneja los cambios en los campos de texto en el formulario de actualización.
  handleChangeActualizar = (e) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      formActualizar: {
        ...prevState.formActualizar,
        [name]: value,
      },
    }));
  };

  // Maneja los cambios en el campo de estado para el formulario de actualización.
  handleChangeEstadoActualizar = (e) => {
    const estado = e.target.value === "true"; // Convertir el valor a booleano
    this.setState({
      formActualizar: {
        ...this.state.formActualizar,
        estado,
      },
    });
  };

  // Maneja los cambios cuando se ingresan valores en el cuadro de búsqueda.
  handleChangeBuscar = (e) => {
    const value = e.target.value;

    clearTimeout(this.debounceTimer); // Cancelar el debounce anterior
    this.setState({ busqueda: value });

    this.debounceTimer = setTimeout(() => {
        this.filtrarElementos();
    }, 300); 
  };

  // Realiza el filtrado de administradores según los campos relevantes.
  filtrarElementos = () => {
    const term = this.state.busqueda.toLowerCase().trim();

    const search = this.state.dataFiltrada.filter((elemento) => {
        const noCuentaAdmin = elemento.noCuentaAdmin 
            ? elemento.noCuentaAdmin.toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "") 
            : "";

        const estadoTexto = elemento.estado ? "reservado" : "libre";

        return (
            elemento.noStand.toString().includes(term) ||
            elemento.nombre.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").includes(term) ||
            elemento.ubicacion.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").includes(term) ||
            noCuentaAdmin.includes(term) ||
            estadoTexto.includes(term)
        );
    });

    this.setState({ data: search });
  };


  // Renderización del componente definido
  render() {
    return (
      <>
        <Container className="CRUDStand">
          <br /> 
          <td>           
          <FormGroup className="d-flex align-items-center">
            <Button style={{width: "200px", marginRight: "10px" }} color="success" onClick={() => this.mostrarModalInsertar()}>
              Nuevo stand
            </Button>
            <Button style={{width: "200px", marginRight: "10px" }} color="success" onClick={() => this.mostrarTodosStands()}>
              Ver stands existentes
            </Button>
            <Button style={{width: "200px", marginRight: "10px" }} color="success" onClick={() => this.CRUDParticipantes()}>
              Administrar participantes
            </Button>
          </FormGroup>
          </td> 
          <div className="barraBusqueda">
            <FormGroup className="d-flex align-items-center">
              <img src="lupa.png" alt="Ícono de búsqueda" style={{ height: '26px', marginRight: '10px'}} />{" "}
              <Input
                type="text"
                placeholder="Buscar"
                className="textField"
                name="busqueda"
                value={this.state.busqueda}
                onChange={this.handleChangeBuscar}
              />
            </FormGroup>
          </div>
          <br />
          <br />
          <Table>
            <thead>
              <tr>
                <th>No. Stand</th>
                <th>Nombre</th>
                <th>Ubicación</th>
                <th>Inicio de operaciones</th>
                <th>Estado</th>
                <th>Responsable</th>
                <th>Acción</th>
              </tr>
            </thead>

            <tbody>
              {this.state.data.map((dato) => (
                <tr key={dato.noStand}>
                  <td>{dato.noStand}</td>
                  <td>{dato.nombre}</td>
                  <td>{dato.ubicacion}</td>
                  <td>{dato.fechahora}</td>
                  <td>{dato.estado ? "reservado" : "libre"}</td>
                  <td>{dato.noCuentaAdmin}</td>
                  <td>
                  <FormGroup>
                    <Button style={{ width: "150px", display: "block", marginBottom: "10px" }}
                     color="primary" onClick={() => this.mostrarModalActualizar(dato)}>
                      Editar
                    </Button>{" "}
                    <Button style={{ width: "150px", display: "block", marginBottom: "10px", 
                    backgroundColor: '#F05E16', borderColor: '#F05E16', transition: 'background-color 0.3s ease' }}
                    onClick={() => this.mostrarModalEliminar(dato)}  onMouseOver={(e) => e.target.style.backgroundColor = '#B05625'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#F05E16'}>
                      Eliminar
                    </Button>
                    </FormGroup>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>

        <Modal isOpen={this.state.modalActualizar}>
          <ModalHeader>
            <div>
              <h3>Actualizar stand</h3>
            </div>
          </ModalHeader>
          <ModalBody>
            <FormGroup className="d-flex flex-column align-items-center">
              <label>Nombre:</label>
              <input
                className="form-control"
                name="nombre"
                type="text"
                onChange={this.handleChangeActualizar}
                value={this.state.formActualizar.nombre}
                style={{ width: "300px"}}
              />{
                this.state.errorsActualizar.nombre && <div className="alert alert-danger">
                  {this.state.errorsActualizar.nombre}
                </div>
              }
            </FormGroup>
            <FormGroup className="d-flex flex-column align-items-center">
              <label>Ubicación:</label>
              <input
                className="form-control"
                name="ubicacion"
                type="text"
                onChange={this.handleChangeActualizar}
                value={this.state.formActualizar.ubicacion}
                style={{ width: "300px"}}
              />{
                this.state.errorsActualizar.ubicacion && <div className="alert alert-danger">
                  {this.state.errorsActualizar.ubicacion}
                </div>
              }
            </FormGroup>
            <FormGroup>
              <label>Fecha y Hora:</label>
              <DatePicker
                className="form-control"
                selected={this.state.formActualizar.fechahora}
                onChange={(date) => this.handleChangeFechaHoraActualizar(date)}
                showTimeSelect
                timeFormat="HH:mm:ss"
                timeIntervals={15}
                dateFormat="yyyy-MM-dd HH:mm:ss"
              />{
                this.state.errorsActualizar.fechahora && <div className="alert alert-danger">
                  {this.state.errorsActualizar.fechahora}
                </div>
              }
            </FormGroup>
            <FormGroup>
              <label>Estado:</label>
              <Input
                type="select"
                className="form-control"
                value={this.state.formActualizar.estado}
                onChange={(e) => this.handleChangeEstadoActualizar(e)}
              >
                <option value="">Selecciona una opción</option>
                <option value="false">Libre</option>
                <option value="true">Reservado</option>
              </Input>{
                this.state.errorsActualizar.estado && <div className="alert alert-danger">
                  {this.state.errorsActualizar.estado}
                </div>
              }
          </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button style={{ width: "150px"}} color="primary" onClick={() => this.editar()}>
              Actualizar
            </Button>
            <Button style={{ width: "150px"}} color="secondary" onClick={() => this.cerrarModalActualizar()}>
              Cancelar
            </Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.modalInsertar}>
          <ModalHeader>
            <div>

              <h3>Insertar stand</h3>
            </div>
          </ModalHeader>
          <ModalBody>

            <FormGroup className="d-flex flex-column align-items-center">
              <label>Nombre:</label>
              <input
                className="form-control"
                name="nombre"
                type="text"
                onChange={this.handleChangeInsertar}
                value={this.state.formInsertar.nombre}
                style={{ width: "300px"}}
              />{
                this.state.errorsInsertar.nombre && <div className="alert alert-danger">
                  {this.state.errorsInsertar.nombre}
                </div>
              }
            </FormGroup>

            <FormGroup className="d-flex flex-column align-items-center">
              <label>Ubicación:</label>
              <input
                className="form-control"
                name="ubicacion"
                type="text"
                onChange={this.handleChangeInsertar}
                value={this.state.formInsertar.ubicacion}
                style={{ width: "300px"}}
              />{
                this.state.errorsInsertar.ubicacion && <div className="alert alert-danger">
                  {this.state.errorsInsertar.ubicacion}
                </div>
              }
            </FormGroup>

            <FormGroup>
              <label>Fecha y Hora:</label>
              <DatePicker
                className="form-control"
                selected={this.state.formInsertar.fechahora}
                onChange={(date) => this.handleChangeFechaHoraInsertar(date)}
                showTimeSelect
                timeFormat="HH:mm:ss"
                timeIntervals={15}
                dateFormat="yyyy-MM-dd HH:mm:ss"
              />{
                this.state.errorsInsertar.fechahora && <div className="alert alert-danger">
                  {this.state.errorsInsertar.fechahora}
                </div>
              }
            </FormGroup>
            <FormGroup>
             <label>Estado:</label>
              <Input
                type="select"
                className="form-control"
                value={this.state.formInsertar.estado}
                onChange={(e) => this.handleChangeEstadoInsertar(e)}
              >
                <option value="">Selecciona una opción</option>
                <option value="false">Libre</option>
                <option value="true">Reservado</option>
              </Input>{
                this.state.errorsInsertar.estado && <div className="alert alert-danger">
                  {this.state.errorsInsertar.estado}
                </div>
              }
            </FormGroup>

          </ModalBody>
          <ModalFooter>
            <Button style={{ width: "150px"}} color="primary" onClick={() => this.insertar()}>
              Insertar
            </Button>
            <Button style={{ width: "150px"}} color="secondary" onClick={() => this.cerrarModalInsertar()}>
              Cancelar
            </Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.modalEliminar}>
          <ModalHeader>

            <div>
              <h3>Eliminar stand</h3>
            </div>
          </ModalHeader>
          <ModalBody>
            <p>¿Estás seguro que deseas eliminar el stand?</p>
          </ModalBody>
          <ModalFooter>
            <Button style={{ width: "150px", display: "block", marginBottom: "10px", 
                    backgroundColor: '#F05E16', borderColor: '#F05E16', transition: 'background-color 0.3s ease' }}
                    onClick={() => this.eliminar({ noStand: this.state.standAEliminar })}  onMouseOver={(e) => e.target.style.backgroundColor = '#B05625'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#F05E16'}>
              Confirmar
            </Button>
            <Button style={{ width: "150px"}} color="secondary" onClick={() => this.cerrarModalEliminar()}>
              Cancelar
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}

export default CRUDStand;