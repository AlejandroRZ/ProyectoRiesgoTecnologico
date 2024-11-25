import React from "react";
import "./CRUDAdmin.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Table,
  Button,
  Container,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  ModalFooter,
  Input
} from "reactstrap";

class CRUDAdmin extends React.Component {
  state = {
    data: [],
    dataFiltrada: [],
    modalActualizar: false,
    modalInsertar: false,
    modalEliminar: false,
    administradorAEliminar: '',
    formInsertar: {
      noCuentaAdmin: "",
      nombre: "",
      apellido: "",
      email: "",
      psswd: "",
    },
    formActualizar: {
      noCuentaAdmin: "",
      nombre: "",
      apellido: "",
      email: "",
    },
    busqueda: "",
    errorsInsertar: {},
    errorsEditar: {},
  };

  // Obtiene la lista de administradores del servidor al montar el componente.
  componentDidMount() {
    fetch("http://127.0.0.1:5000/admin/readadmin")
      .then((response) => response.json())
      .then((data) => {
        this.setState({ data: data, dataFiltrada: data });
      })
      .catch((error) => {
        alert("Error al obtener datos del servidor:", error);
      });
  }

  // Realiza la redirección a la nueva página
  mostrarTodosStands = () => {    
    window.location.href = "http://localhost:3000/vistaStand";
  };

  // Abre el modal para actualizar un administrador con los datos prellenados.
  mostrarModalActualizar = (dato) => {
    this.setState({
      formActualizar: dato,
      modalActualizar: true,
    });
  };

  // Cierra el modal de actualización y limpia los errores.
  cerrarModalActualizar = () => {
    this.setState({ errorsEditar: {} });
    this.setState({ modalActualizar: false });
  };


  // Abre el modal para insertar un nuevo administrador.
  mostrarModalInsertar = () => {
    this.setState({
      modalInsertar: true,
    });
  };

  // Cierra el modal de inserción y limpia los errores.
  cerrarModalInsertar = () => {
    this.setState({ errorsInsertar: {} });
    this.setState({ modalInsertar: false });
  };

  // Abre el modal para confirmar la eliminación de un administrador.
  mostrarModalEliminar = (dato) => {
    this.setState({
      modalEliminar: true,
      administradorAEliminar: dato.noCuentaAdmin
    });
  }

  // Cierra el modal de eliminación.
  cerrarModalEliminar = () => {
    this.setState({ modalEliminar: false });
  }

  // Actualiza la información de un administrador después de validar los datos.
  editar = () => {
    if (!this.datosValidosEditar()) {
      return;
    }
    const { noCuentaAdmin, nombre, apellido, email } = this.state.formActualizar;
    fetch("http://127.0.0.1:5000/admin/updateadmin", {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ noCuentaAdmin, nombre, apellido, email }),
    })
      .then(response => response.json())
      .then((data) => {
        this.componentDidMount();
        this.cerrarModalActualizar();
      })
      .catch(error => {
        console.error("Error al editar administrador:", error);
        alert("Error al editar administrador. Por favor, inténtalo nuevamente más tarde.");
        this.setState({ modalActualizar: false });
      });
  };

  // Elimina un administrador después de confirmar la acción.
  eliminar = (dato) => {
    fetch("http://127.0.0.1:5000/admin/deleteadmin", {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ noCuentaAdmin: dato.noCuentaAdmin }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.message) {
          this.componentDidMount();
          this.setState({ modalEliminar: false, administradorAEliminar: null });
        } else {
          alert('Error al eliminar administrador en el servidor: ' + data.error);
        }
      })
      .catch(error => {
        console.error("Error al eliminar administrador:", error);
        alert("Error al eliminar administrador. Por favor, inténtalo más tarde.");
      });
  };

  // Inserta un nuevo administrador después de validar los datos.
  insertar = () => {
    if (!this.datosValidosInsertar()) {
      return;
    }
    const {noCuentaAdmin, nombre, apellido, email, psswd } = this.state.formInsertar;
    var noCuentaSupAdm = localStorage.getItem('noCuenta');
    fetch("http://127.0.0.1:5000/admin/insertadmin", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({noCuentaAdmin, nombre, apellido, email, psswd, noCuentaSupAdm }),
    })
      .then(response => response.json())
      .then(() => {
        this.componentDidMount();
        this.cerrarModalInsertar();
      })
      .catch(error => {
        console.error("Error al insertar administrador:", error);
        alert("Error al insertar administrador. Por favor, inténtalo nuevamente más tarde.");
        this.setState({ modalInsertar: false });
      });
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

  // Maneja los cambios en los campos de texto para el formulario de actualización.
  handleChangeActualizar = (e) => {
    this.setState({
      formActualizar: {
        ...this.state.formActualizar,
        [e.target.name]: e.target.value,
      },
    });
  };

  // Maneja los cambios cuando se ingresan valores en el cuadro de búsqueda
  handleChangeBuscar = async (e) => {
    e.persist();
    const value = e.target.value;

    await this.setState({ busqueda: value });

    if (value === "") {
        this.setState({ data: this.state.dataFiltrada });
    } else {
        this.filtrarElementos();
    }
  };

  // Realiza el filtrado de administradores según los campos relevantes.
  filtrarElementos = () => {
    const search = this.state.dataFiltrada.filter(item => {
      return (
        item.noCuentaAdmin.toString().includes(this.state.busqueda) ||
        item.nombre.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").includes(this.state.busqueda.toLowerCase()) ||
        item.apellido.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").includes(this.state.busqueda.toLowerCase()) ||
        item.email.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").includes(this.state.busqueda.toLowerCase())
      );
    });
    this.setState({ data: search });
  };

  // Valida los datos del formulario de inserción.
  datosValidosInsertar = () => {
    let errorsInsertar = {};
    let isValid = true;

    if (this.state.formInsertar.noCuentaAdmin.length !== 9) {
      isValid = false;
      errorsInsertar["noCuentaAdmin"] = "Número de cuenta no válido.";
    }

    if (!this.state.formInsertar.email) {
      isValid = false;
      errorsInsertar["email"] = "Por favor ingresa un correo.";
    } else {
      if (typeof this.state.formInsertar.email !== "undefined") {
        let lastAtPos = this.state.formInsertar.email.lastIndexOf('@');
        let lastDotPos = this.state.formInsertar.email.lastIndexOf('.');

        if (!(lastAtPos < lastDotPos && lastAtPos > 0 && this.state.formInsertar.email.indexOf('@@') === -1 && lastDotPos > 2 && (this.state.formInsertar.email.length - lastDotPos) > 2)) {
          isValid = false;
          errorsInsertar["email"] = "Correo inválido.";
        }
      }
    }

    if (!this.state.formInsertar.psswd) {
      isValid = false;
      errorsInsertar["password"] = "Por favor ingresa una contraseña.";
    } else if (this.state.formInsertar.psswd.length < 8) {
      isValid = false;
      errorsInsertar["password"] = "La contraseña debe tener al menos 8 caracteres.";
    } 

    this.setState({ errorsInsertar });
    return isValid;
  }

  // Valida los datos del formulario de actualización.
  datosValidosEditar = () => {
    let errorsEditar = {};
    let isValid = true;

    if (!this.state.formActualizar.email) {
      isValid = false;
      errorsEditar["email"] = "Por favor ingresa un correo.";
    } else {
      if (typeof this.state.formActualizar.email !== "undefined") {
        let lastAtPos = this.state.formActualizar.email.lastIndexOf('@');
        let lastDotPos = this.state.formActualizar.email.lastIndexOf('.');

        if (!(lastAtPos < lastDotPos && lastAtPos > 0 && this.state.formActualizar.email.indexOf('@@') === -1 && lastDotPos > 2 && (this.state.formActualizar.email.length - lastDotPos) > 2)) {
          isValid = false;
          errorsEditar["email"] = "Correo inválido.";
        }
      }
    }

    this.setState({ errorsEditar });
    return isValid;
  }

  // Renderización del componente definido
  render() {
    return (
      <>
        <Container className="CRUDAdmin">
          <br />
          <td>
          <div className="d-flex justify-content-between">
            <button onClick={() => this.mostrarModalInsertar()}>Nuevo administrador</button>
            <button onClick={() => this.mostrarTodosStands()}>Ver stands registrados</button>
          </div>
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
                <th>No. Cuenta</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Email</th>
                <th>Acción</th>
              </tr>
            </thead>

            <tbody>
              {this.state.data.map((dato) => (
                <tr key={dato.noCuentaAdmin}>
                  <td>{dato.noCuentaAdmin}</td>
                  <td>{dato.nombre}</td>
                  <td>{dato.apellido}</td>
                  <td>{dato.email}</td>
                  <td>
                    <button
                      style={{ width: "150px", display: "block", marginBottom: "10px" }}
                      color="primary"
                      onClick={() => this.mostrarModalActualizar(dato)}
                    >Editar
                    </button>{" "}
                    <button style={{ width: "150px", display: "block", marginBottom: "10px", 
                    backgroundColor: '#F05E16', borderColor: '#F05E16', transition: 'background-color 0.3s ease' }} 
                    onClick={() => this.mostrarModalEliminar(dato)}onMouseOver={(e) => e.target.style.backgroundColor = '#B05625'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#F05E16'}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>


        <Modal isOpen={this.state.modalActualizar}>
          <ModalHeader>
            <div><h3>Editar Administrador</h3></div>
          </ModalHeader>

          <ModalBody>
            <FormGroup>
              <label>
                Nombre:
              </label>

              <input
                className="form-control"
                name="nombre"
                type="text"
                onChange={this.handleChangeActualizar}
                value={this.state.formActualizar.nombre}
              />
            </FormGroup>

            <FormGroup>
              <label>
                Apellido:
              </label>
              <input
                className="form-control"
                name="apellido"
                type="text"
                onChange={this.handleChangeActualizar}
                value={this.state.formActualizar.apellido}
              />
            </FormGroup>

            <FormGroup>
              <label>
                Email:
              </label>
              <input
                className="form-control"
                name="email"
                type="email"
                onChange={this.handleChangeActualizar}
                value={this.state.formActualizar.email}
                required
              />
              {
                this.state.errorsEditar.email && <div className="alert alert-danger">
                  {this.state.errorsEditar.email}
                </div>
              }
            </FormGroup>
          </ModalBody>

          <ModalFooter>
            <button
              style={{ width: "150px"}} color="primary"
              onClick={() => this.editar()}
            >
              Editar
            </button>
            <button
              style={{ width: "150px"}} color="secondary"
              onClick={() => this.cerrarModalActualizar()}
            >
              Cancelar
            </button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.modalInsertar}>
          <ModalHeader>
            <div><h3>Insertar Administrador</h3></div>
          </ModalHeader>

          <ModalBody>

          <FormGroup>
              <label>
                No de cuenta:
              </label>

              <input
                className="form-control"
                name="noCuentaAdmin"
                type="number"
                onChange={this.handleChangeInsertar}
              />
               {
                this.state.errorsInsertar.noCuentaAdmin && <div className="alert alert-danger">
                  {this.state.errorsInsertar.noCuentaAdmin}
                </div>
              }
            </FormGroup>

            <FormGroup>
              <label>
                Nombre:
              </label>

              <input
                className="form-control"
                name="nombre"
                type="text"
                onChange={this.handleChangeInsertar}
                required
              />
            </FormGroup>

            <FormGroup>
              <label>
                Apellido:
              </label>
              <input
                className="form-control"
                name="apellido"
                type="text"
                onChange={this.handleChangeInsertar}
                required
              />
            </FormGroup>

            <FormGroup>
              <label>
                Email:
              </label>
              <input
                className="form-control"
                name="email"
                type="email"
                onChange={this.handleChangeInsertar}
                required
              />
              {
                this.state.errorsInsertar.email && <div className="alert alert-danger">
                  {this.state.errorsInsertar.email}
                </div>
              }
            </FormGroup>

            <FormGroup>
              <label>
                Contraseña:
              </label>
              <input
                className="form-control"
                name="psswd"
                type="password"
                onChange={this.handleChangeInsertar}
                required
              />
              {
                this.state.errorsInsertar.password && <div className="alert alert-danger">
                  {this.state.errorsInsertar.password}
                </div>
              }
            </FormGroup>
          </ModalBody>

          <ModalFooter>
            <button
              style={{ width: "150px"}} color="primary" 
              onClick={() => this.insertar()}
            >
              Insertar
            </button>
            <button
              style={{ width: "150px"}} color="secondary"
              onClick={() => this.cerrarModalInsertar()}
            >
              Cancelar
            </button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.modalEliminar}>
          <ModalHeader>
            <div><h3>Eliminar Administrador</h3></div>
          </ModalHeader>
          <ModalBody>
            <p>¿Está seguro de eliminar el administrador con No. de cuenta: {this.state.administradorAEliminar}?</p>
          </ModalBody>

          <ModalFooter>
            <button style={{ width: "150px", display: "block", marginBottom: "10px", 
                    backgroundColor: '#F05E16', borderColor: '#F05E16', transition: 'background-color 0.3s ease' }} 
                    onClick={() => this.eliminar({ noCuentaAdmin: this.state.administradorAEliminar })}  
                    onMouseOver={(e) => e.target.style.backgroundColor = '#B05625'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#F05E16'}>
              Confirmar
            </button>
            <button style={{ width: "150px"}} color="secondary"  onClick={() => this.setState({ modalEliminar: false, administradorAEliminar: null })}>
              Cancelar
            </button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}

export default CRUDAdmin;