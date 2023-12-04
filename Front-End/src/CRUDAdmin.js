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
      nombre: "",
      apellido: "",
      email: "",
      psswd: "",
    },
    formActualizar: {
      id: "",
      nombre: "",
      apellido: "",
      email: "",
    },
    busqueda: "",
    errorsInsertar: {},
    errorsEditar: {},
  };

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

  mostrarTodosTorneos = () => {
    // Realiza la redirección a la nueva página
    window.location.href = "http://localhost:3000/vistaTorneos";
  };


  mostrarModalActualizar = (dato) => {
    this.setState({
      formActualizar: dato,
      modalActualizar: true,
    });
  };

  cerrarModalActualizar = () => {
    this.setState({ errorsEditar: {} });
    this.setState({ modalActualizar: false });
  };

  mostrarModalInsertar = () => {
    this.setState({
      modalInsertar: true,
    });
  };

  cerrarModalInsertar = () => {
    this.setState({ errorsInsertar: {} });
    this.setState({ modalInsertar: false });
  };

  mostrarModalEliminar = (dato) => {
    this.setState({
      modalEliminar: true,
      administradorAEliminar: dato.id
    });
  }

  cerrarModalEliminar = () => {
    this.setState({ modalEliminar: false });
  }

  editar = () => {
    if (!this.datosValidosEditar()) {
      return;
    }
    const { id, nombre, apellido, email } = this.state.formActualizar;
    fetch("http://127.0.0.1:5000/admin/updateadmin", {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, nombre, apellido, email }),
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

  eliminar = (dato) => {
    fetch("http://127.0.0.1:5000/admin/deleteadmin", {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idAdministrador: dato.id }),
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

  // const res = await fetch(`http://127.0.0.1:5000/login`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-type': 'application/json',
  //       },
  //       body: JSON.stringify({ email, password })
  //     });
  //     const data = await res.json();

  insertar = () => {
    if (!this.datosValidosInsertar()) {
      return;
    }
    const { nombre, apellido, email, psswd } = this.state.formInsertar;
    var idCreador = localStorage.getItem('id');
    fetch("http://127.0.0.1:5000/admin/insertadmin", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nombre, apellido, email, psswd, idCreador }),
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

  handleChangeInsertar = (e) => {
    this.setState({
      formInsertar: {
        ...this.state.formInsertar,
        [e.target.name]: e.target.value,
      },
    });
  };

  handleChangeActualizar = (e) => {
    this.setState({
      formActualizar: {
        ...this.state.formActualizar,
        [e.target.name]: e.target.value,
      },
    });
  };

  handleChangeBuscar = async (e) => {
    e.persist();
    await this.setState({ busqueda: e.target.value });
    this.filtrarElementos();
  }

  filtrarElementos = () => {
    var search = this.state.dataFiltrada.filter(item => {
      return (
        item.id.toString().includes(this.state.busqueda) ||
        item.nombre.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").includes(this.state.busqueda.toLowerCase()) ||
        item.apellido.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").includes(this.state.busqueda.toLowerCase()) ||
        item.email.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").includes(this.state.busqueda.toLowerCase())
      );
    });
    this.setState({ data: search });
  }

  datosValidosInsertar = () => {
    let errorsInsertar = {};
    let isValid = true;

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


  render() {
    return (
      <>
        <Container className="CRUDAdmin">
          <br />
          <div className="d-flex justify-content-between">
            <Button style={{ marginRight: '10px' }} color="success" onClick={() => this.mostrarModalInsertar()}>Nuevo administrador</Button>
            <Button style={{ marginRight: '10px' }} color="success" onClick={() => this.mostrarTodosTorneos()}>Ver Torneos Actuales</Button>
          </div>
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
                <th>ID</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Email</th>
                <th>Acción</th>
              </tr>
            </thead>

            <tbody>
              {this.state.data.map((dato) => (
                <tr key={dato.id}>
                  <td>{dato.id}</td>
                  <td>{dato.nombre}</td>
                  <td>{dato.apellido}</td>
                  <td>{dato.email}</td>
                  <td>
                    <Button
                      color="primary"
                      onClick={() => this.mostrarModalActualizar(dato)}
                    >Editar
                    </Button>{" "}
                    <Button color="danger" onClick={() => this.mostrarModalEliminar(dato)}>Eliminar</Button>
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
            <Button
              color="primary"
              onClick={() => this.editar()}
            >
              Editar
            </Button>
            <Button
              color="danger"
              onClick={() => this.cerrarModalActualizar()}
            >
              Cancelar
            </Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.modalInsertar}>
          <ModalHeader>
            <div><h3>Insertar Administrador</h3></div>
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
                onChange={this.handleChangeInsertar}
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
              />
              {
                this.state.errorsInsertar.password && <div className="alert alert-danger">
                  {this.state.errorsInsertar.password}
                </div>
              }
            </FormGroup>
          </ModalBody>

          <ModalFooter>
            <Button
              color="primary"
              onClick={() => this.insertar()}
            >
              Insertar
            </Button>
            <Button
              className="btn btn-danger"
              onClick={() => this.cerrarModalInsertar()}
            >
              Cancelar
            </Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.modalEliminar}>
          <ModalHeader>
            <div><h3>Eliminar Administrador</h3></div>
          </ModalHeader>
          <ModalBody>
            <p>¿Está seguro de eliminar el administrador con id: {this.state.administradorAEliminar}?</p>
          </ModalBody>

          <ModalFooter>
            <Button color="danger" onClick={() => this.eliminar({ id: this.state.administradorAEliminar })}>
              Confirmar
            </Button>
            <Button color="secondary" onClick={() => this.setState({ modalEliminar: false, administradorAEliminar: null })}>
              Cancelar
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}

export default CRUDAdmin;
