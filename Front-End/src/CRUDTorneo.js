//import React from "react";
import React from "react";
import "./CRUDTorneo.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Table, Button, Container, Modal, ModalHeader, ModalBody, FormGroup, ModalFooter } from "reactstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";



class CRUDTorneo extends React.Component {
  state = {
    data: [],
    dataFiltrada: [],
    modalActualizar: false,
    modalInsertar: false,
    modalEliminar: false,
    torneoAEliminar: "",
    formInsertar: {
      nombre: "",
      fechahora: new Date(),
      idAdministrador: "",
    },
    formActualizar: {
      id: "",
      nombre: "",
      fechahora: new Date(),
    },
    busqueda: "",
  };


  componentDidMount() {
    fetch("http://127.0.0.1:5000/torneo/readtorneos")
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
    //window.location.href = "http://localhost:5000/torneo/readtorneos";
  };

  mostrarModalActualizar = (dato) => {
  const fechaFormateada = new Date(dato.fechahora);
  const { id, nombre, fechahora, idAdministrador } = dato;
  this.setState({
    formActualizar: {
      id,
      nombre,
      fechahora: fechaFormateada,
      idAdministrador,
    },
    modalActualizar: true,
  });
  };



  cerrarModalActualizar = () => {
    this.setState({ modalActualizar: false });
  };

  mostrarModalInsertar = () => {
    this.setState({
      modalInsertar: true,
    });
  };

  cerrarModalInsertar = () => {
    this.setState({ modalInsertar: false });
  };

  mostrarModalEliminar = (dato) => {
    this.setState({
      modalEliminar: true,
      torneoAEliminar: dato.id,
    });
  };

  cerrarModalEliminar = () => {
    this.setState({ modalEliminar: false });
  };

  editar = () => {
    const { id, nombre, fechahora, idAdministrador } = this.state.formActualizar; 
    const fechaFormateada = fechahora.toISOString().slice(0, 19);

    fetch("http://127.0.0.1:5000/torneo/updatetorneo", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, nombre, fechahora: fechaFormateada, idAdministrador}),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        this.componentDidMount();
        this.setState({ modalActualizar: false });
      })
      .catch((error) => {
        console.error("Error al editar torneo:", error);
        alert("Error al editar torneo. Por favor, inténtalo nuevamente más tarde.");
        this.setState({ modalActualizar: false });
      });
  };

  eliminar = (dato) => {
  fetch("http://127.0.0.1:5000/torneo/deletetorneo", {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ idTorneo: dato.id }),
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      if (data.message) {
        this.componentDidMount();
        this.setState({ modalEliminar: false, torneoAEliminar: null });
      } else {
        alert('Error al eliminar torneo en el servidor: ' + data.error);
      }
    })
    .catch(error => {
      console.error("Error al eliminar torneo:", error);
      alert("Error al eliminar torneo. Por favor, inténtalo más tarde.");
    });
};


  insertar = () => {
    const { nombre, fechahora, idAdministrador } = this.state.formInsertar;
    const fechaFormateada = fechahora.toISOString().slice(0,19);
    console.log("fecha y hora:", fechahora );

    fetch("http://127.0.0.1:5000/torneo/inserttorneo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nombre, fechaHora: fechaFormateada + ".000Z", idAdministrador}),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        this.setState({ modalInsertar: false });
        this.componentDidMount();
      })
      .catch(error => {
        console.error("Error al insertar torneo:", error);
        alert("Error al insertar torneo. Por favor, inténtalo nuevamente más tarde.");
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

  handleChangeFechaInsertar = (date) => {
    this.setState((prevState) => ({
      formInsertar: {
        ...prevState.formInsertar,
        fechahora: date,
      },
    }));
  };

  handleChangeFechaHoraActualizar = (date) => {
    this.setState((prevState) => ({
      formActualizar: {
        ...prevState.formActualizar,
        fechahora: new Date(date.setSeconds(0)), // Ajusta según tus necesidades
      },
    }));
  };


  handleChangeActualizar = (e) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      formActualizar: {
        ...prevState.formActualizar,
        [name]: value,
      },
    }));
  };

  handleChangeBuscar = async (e) => {
    e.persist();
    await this.setState({ busqueda: e.target.value });
    this.filtrarElementos();
  };

  filtrarElementos = () => {
    const dataFiltrada = this.state.data.filter(
      (elemento) =>
        elemento.nombre.toLowerCase().includes(this.state.busqueda.toLowerCase()) ||
        elemento.fechahora.toLowerCase().includes(this.state.busqueda.toLowerCase())
    );
    this.setState({ data: dataFiltrada });
  };

  render() {
    return (
      <>
        <Container className="CRUDTorneo">
          <br />
          <div className="d-flex justify-content-between">
            <Button style={{ marginRight: "10px" }} color="success" onClick={() => this.mostrarModalInsertar()}>
              Nuevo Torneo
            </Button>
            <Button style={{ marginRight: "10px" }} color="success" onClick={() => this.mostrarTodosTorneos()}>
              Ver Torneos Actuales
            </Button>
          </div>
          <div className="barraBusqueda">
            <input
              type="text"
              placeholder="Buscar"
              className="textField"
              name="busqueda"
              value={this.state.busqueda}
              onChange={this.handleChangeBuscar}
            />
            <Button className="btnBuscar" color="primary">
              Buscar
            </Button>
          </div>
          <br />
          <br />
          <Table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Fecha y Hora</th>
                <th>Acción</th>
              </tr>
            </thead>

            <tbody>
              {this.state.data.map((dato) => (
                <tr key={dato.id}>
                  <td>{dato.id}</td>
                  <td>{dato.nombre}</td>
                  <td>{dato.fechahora}</td>

                  <td>
                    <Button color="primary" onClick={() => this.mostrarModalActualizar(dato)}>
                      Editar
                    </Button>{" "}
                    <Button color="danger" onClick={() => this.mostrarModalEliminar(dato)}>
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>

        <Modal isOpen={this.state.modalActualizar}>
          <ModalHeader>
            <div>
              <h3>Actualizar Torneo</h3>
            </div>
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              <label>Nombre:</label>
              <input
                className="form-control"
                name="nombre"
                type="text"
                onChange={this.handleChangeActualizar}
                value={this.state.formActualizar.nombre}
              />
            </FormGroup>
            <FormGroup>
              <label>Fecha y Hora:</label>
              <DatePicker
                className="form-control"
                selected={this.state.formActualizar.fechahora}
                onChange={(date) => this.handleChangeFechaHoraActualizar(date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="yyyy-MM-dd HH:mm:ss"
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={() => this.editar()}>
              Actualizar
            </Button>
            <Button color="danger" onClick={() => this.cerrarModalActualizar()}>
              Cancelar
            </Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.modalInsertar}>
          <ModalHeader>
            <div>

              <h3>Insertar Torneo</h3>
            </div>
          </ModalHeader>
          <ModalBody>

            <FormGroup>
              <label>Nombre:</label>
              <input
                className="form-control"
                name="nombre"
                type="text"
                onChange={this.handleChangeInsertar}
                value={this.state.formInsertar.nombre}
              />
            </FormGroup>

            <FormGroup>
              <label>Fecha y Hora:</label>
              <DatePicker
                className="form-control"
                selected={this.state.formInsertar.fechahora}
                onChange={(date) => this.handleChangeFechaHoraActualizar(date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="yyyy-MM-dd HH:mm:ss"
              />
            </FormGroup>
            <FormGroup>
              <label>ID Administrador:</label>
              <input
                className="form-control"
                name="idAdministrador"
                type="text"
                onChange={this.handleChangeInsertar}
                value={this.state.formInsertar.idAdministrador}
              />
            </FormGroup>

          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={() => this.insertar()}>
              Insertar
            </Button>
            <Button color="danger" onClick={() => this.cerrarModalInsertar()}>
              Cancelar
            </Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.modalEliminar}>
          <ModalHeader>

            <div>
              <h3>Eliminar Torneo</h3>
            </div>
          </ModalHeader>
          <ModalBody>
            <p>¿Estás seguro que deseas eliminar el torneo?</p>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={() => this.eliminar()}>
              Confirmar
            </Button>
            <Button color="secondary" onClick={() => this.cerrarModalEliminar()}>
              Cancelar
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}

export default CRUDTorneo;


