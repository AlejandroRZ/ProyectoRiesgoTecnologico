//import React from "react";
import React from "react";
import "./CRUDTorneo.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Table, Button, Container, Modal, ModalHeader, ModalBody, FormGroup, ModalFooter, Input} from "reactstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";


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
    const { id, nombre, fechahora, noCuentaAdmin } = dato;
    this.setState({
      formActualizar: {
        id,
        nombre,
        fechahora: fechaFormateada,
        noCuentaAdmin,
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
    const { id, nombre, fechahora, noCuentaAdmin } = this.state.formActualizar;
    /*const fechaFormateada = fechahora.toISOString().slice(0, 19);*/
    const fechaFormateada = moment(fechahora).format("YYYY-MM-DDTHH:mm:ss");

    fetch("http://127.0.0.1:5000/torneo/updatetorneo", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, nombre, fechahora: fechaFormateada, noCuentaAdmin }),
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
    const { nombre, fechahora } = this.state.formInsertar;
    /*const fechaFormateada = fechahora.toISOString().slice(0, 19); */
    const fechaFormateada = moment(fechahora).format("YYYY-MM-DDTHH:mm:ss");
    console.log("fecha y hora:", fechahora);

    fetch("http://127.0.0.1:5000/torneo/inserttorneo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nombre, fechaHora: fechaFormateada, noCuentaAdmin: localStorage.getItem('noCuenta') }),
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

  handleChangeFechaHoraInsertar = (date) => {
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
        fechahora:date, // Ajusta según tus necesidades
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
    var search = this.state.dataFiltrada.filter(
      (elemento) =>
        elemento.nombre.toLowerCase().includes(this.state.busqueda.toLowerCase()) ||
        elemento.fechahora.toLowerCase().includes(this.state.busqueda.toLowerCase())
    );
    this.setState({ data: search });
  };

  render() {
    return (
      <>
        <Container className="CRUDTorneo">
          <br /> 
          <td>           
          <FormGroup className="d-flex align-items-center">
            <Button style={{width: "200px", marginRight: "10px" }} color="success" onClick={() => this.mostrarModalInsertar()}>
              Nuevo Torneo
            </Button>
            <Button style={{width: "200px", marginRight: "10px" }} color="success" onClick={() => this.mostrarTodosTorneos()}>
              Ver Torneos Actuales
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
              <h3>Actualizar Torneo</h3>
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
              />
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
              />
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

              <h3>Insertar Torneo</h3>
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
              />
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
              />
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
              <h3>Eliminar Torneo</h3>
            </div>
          </ModalHeader>
          <ModalBody>
            <p>¿Estás seguro que deseas eliminar el torneo?</p>
          </ModalBody>
          <ModalFooter>
            <Button style={{ width: "150px", display: "block", marginBottom: "10px", 
                    backgroundColor: '#F05E16', borderColor: '#F05E16', transition: 'background-color 0.3s ease' }}
                    onClick={() => this.eliminar({ id: this.state.torneoAEliminar })}  onMouseOver={(e) => e.target.style.backgroundColor = '#B05625'}
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

export default CRUDTorneo;


