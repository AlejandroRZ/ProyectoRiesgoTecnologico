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
    },
    formActualizar: {
      noStand: "",
      nombre: "",
      fechahora: new Date(),
    },
    busqueda: "",
  };


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

  mostrarTodosStands = () => {
    // Realiza la redirección a la nueva página
    window.location.href = "http://localhost:3000/vistaStand";    
  };

  mostrarModalActualizar = (dato) => {
    const fechaFormateada = new Date(dato.fechahora);
    const { noStand, nombre, fechahora, noCuentaAdmin } = dato;
    this.setState({
      formActualizar: {
        noStand,
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
      standAEliminar: dato.noStand,
    });
  };

  cerrarModalEliminar = () => {
    this.setState({ modalEliminar: false });
  };

  editar = () => {
    const { noStand, nombre, fechahora, noCuentaAdmin } = this.state.formActualizar;
    /*const fechaFormateada = fechahora.toISOString().slice(0, 19);*/
    const fechaFormateada = moment(fechahora).format("YYYY-MM-DDTHH:mm:ss");

    fetch("http://127.0.0.1:5000/stand/updatestand", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ noStand, nombre, fechahora: fechaFormateada, noCuentaAdmin }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        this.componentDidMount();
        this.setState({ modalActualizar: false });
      })
      .catch((error) => {
        console.error("Error al editar stand", error);
        alert("Error al editar stand. Por favor, inténtalo nuevamente más tarde.");
        this.setState({ modalActualizar: false });
      });
  };

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
        console.log(data);
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


  insertar = () => {
    const { nombre, ubicacion, fechahora } = this.state.formInsertar;
    /*const fechaFormateada = fechahora.toISOString().slice(0, 19); */
    const fechaFormateada = moment(fechahora).format("YYYY-MM-DDTHH:mm:ss");
    console.log("fecha y hora:", fechahora);

    fetch("http://127.0.0.1:5000/stand/insertstand", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nombre, ubicacion, fechaHora: fechaFormateada, noCuentaAdmin: localStorage.getItem('noCuenta') }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        this.setState({ modalInsertar: false });
        this.componentDidMount();
      })
      .catch(error => {
        console.error("Error al insertar stand:", error);
        alert("Error al insertar stand. Por favor, inténtalo nuevamente más tarde.");
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
                <th>Fecha y Hora</th>
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
              />
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


