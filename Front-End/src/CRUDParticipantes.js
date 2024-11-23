import React from "react";
import "./CRUDParticipantes.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Table,  
  Container,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  ModalFooter,
  Input
} from "reactstrap";

class CRUDParticipantes extends React.Component {
  state = {
    data: [],
    dataFiltrada: [],
    modalAsignar: false,    
    modalEliminar: false,
    participanteAEliminar: '',    
    formAsignar: {
      noCuenta: "",
      noStand: "",
    },
    busqueda: "",    
    errorsAsignarStand: {},
  };

  componentDidMount() {
    fetch("http://127.0.0.1:5000/admin/readparticipante")
      .then((response) => response.json())
      .then((data) => {
        this.setState({ data: data, dataFiltrada: data });
      })
      .catch((error) => {
        alert("Error al obtener datos del servidor:", error);
      });
  }

  CRUDStands = () => {
    // Realiza la redirección a la nueva página
    window.location.href = "http://localhost:3000/administrador";
  };


  mostrarModalAsignar = (dato) => {
    this.setState({
      formAsignar: dato,
      modalAsignar: true,
    });
  };

  cerrarModalAsignar = () => {
    this.setState({ errorsAsignarStand: {} });
    this.setState({ modalAsignar: false });
  };

  mostrarModalEliminar = (dato) => {
    this.setState({
      modalEliminar: true,
      participanteAEliminar: dato.noCuenta
    });
  }

  cerrarModalEliminar = () => {
    this.setState({ modalEliminar: false });
  }

  asignarStand = async () => {
    if (!this.datosValidosasignarStand()) {
      return;
    }
    try{
      const { noCuenta, noStand } = this.state.formAsignar;
      const response = await fetch("http://127.0.0.1:5000/admin/asignarStand", {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ noCuenta, noStand}),
      });

      const data = await response.json();
      if (response.ok && data.message === "Stand asignado exitosamente") {
        this.componentDidMount();
        this.cerrarModalAsignar();        
      }else{
         // Manejar errores de la respuesta
         const errorsAsignarStand = {};
  
         if (data.error === "No existe tal stand") {
           errorsAsignarStand["noStand"] = "No hay un stand identificado por tal número";
         } else {
           errorsAsignarStand["noStand"] = "Error desconocido. Por favor, inténtalo nuevamente.";
         }  
         // Actualizar estado con los errores
         this.setState({ errorsAsignarStand });
         return; // Detener ejecución
      }
    }catch(error) {
        console.error("Error al asignar stand:", error);
        alert("Error al asignar stand. Por favor, inténtalo nuevamente más tarde.");
        this.setState({ modalAsignar: false });
    }
  };

  eliminar = (dato) => {
    fetch("http://127.0.0.1:5000/admin/eliminarParticipante", {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ noCuenta: dato.noCuenta }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.message === 'Participante eliminado exitosamente') {
          this.componentDidMount();
          this.setState({ modalEliminar: false, participanteAEliminar: null });
        } else {
          alert('Error al eliminar participante en el servidor: ' + data.error);
        }
      })
      .catch(error => {
        console.error("Error al eliminar participante:", error);
        alert("Error al eliminar participante. Por favor, inténtalo más tarde.");
      });
  };


  handleChangeAsignar = (e) => {
    this.setState({
      formAsignar: {
        ...this.state.formAsignar,
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
        item.noCuenta.toString().includes(this.state.busqueda) ||
        item.nombre.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").includes(this.state.busqueda.toLowerCase()) ||
        item.apellido.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").includes(this.state.busqueda.toLowerCase()) ||
        item.email.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").includes(this.state.busqueda.toLowerCase())
      );
    });
    this.setState({ data: search });
  }

  
  datosValidosasignarStand = () => {
    let errorsAsignarStand = {};
    let isValid = true;

    if (!this.state.formAsignar.noStand) {
      isValid = false;
      errorsAsignarStand["noStand"] = "Debes de ingresar un número de stand";
    }

    if (this.state.formAsignar.noStand < 0 || !Number.isInteger(Number(this.state.formAsignar.noStand))) {
      isValid = false;
      errorsAsignarStand["noStand"] = "Número de stand no válido.";
    }

    this.setState({ errorsAsignarStand });
    return isValid;
  }


  render() {
    return (
      <div className="Administrador">
      <div className="container">
        <h1>¡Hola, administrador!</h1>
      <>
        <Container className="CRUDParticipantes">
          <br />
          <td>
          <div className="d-flex justify-content-between">            
            <button onClick={() => this.CRUDStands()}>volver a la vista general</button>
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
                <th>No. Stand</th>
                <th>Acción</th>
              </tr>
            </thead>

            <tbody>
              {this.state.data.map((dato) => (
                <tr key={dato.noCuenta}>
                  <td>{dato.noCuenta}</td>
                  <td>{dato.nombre}</td>
                  <td>{dato.apellido}</td>
                  <td>{dato.email}</td>
                  <td>{dato.noStand}</td>
                  <td>
                    <button
                      style={{ width: "150px", display: "block", marginBottom: "10px" }}
                      color="primary"
                      onClick={() => this.mostrarModalAsignar(dato)}
                    >Asignar Stand
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


        <Modal isOpen={this.state.modalAsignar}>
          <ModalHeader>
            <div><h3>Asignar stand</h3></div>
          </ModalHeader>
          <ModalBody>           

            <FormGroup>
              <label>
                No. Stand:
              </label>
              <input
                className="form-control"
                name="noStand"
                type="number"
                onChange={this.handleChangeAsignar}
                value={this.state.formAsignar.noStand}
                required
              />
              {
                this.state.errorsAsignarStand.noStand && <div className="alert alert-danger">
                  {this.state.errorsAsignarStand.noStand}
                </div>
              }
            </FormGroup>
          </ModalBody>

          <ModalFooter>
            <button
              style={{ width: "150px"}} color="primary"
              onClick={() => this.asignarStand()}
            >
              Asignar Stand
            </button>
            <button
              style={{ width: "150px"}} color="secondary"
              onClick={() => this.cerrarModalAsignar()}
            >
              Cancelar
            </button>
          </ModalFooter>
        </Modal>

       

        <Modal isOpen={this.state.modalEliminar}>
          <ModalHeader>
            <div><h3>Eliminar participante</h3></div>
          </ModalHeader>
          <ModalBody>
            <p>¿Está seguro de eliminar el participante con No. de cuenta: {this.state.participanteAEliminar}?</p>
          </ModalBody>

          <ModalFooter>
            <button style={{ width: "150px", display: "block", marginBottom: "10px", 
                    backgroundColor: '#F05E16', borderColor: '#F05E16', transition: 'background-color 0.3s ease' }} 
                    onClick={() => this.eliminar({ noCuenta: this.state.participanteAEliminar })}  
                    onMouseOver={(e) => e.target.style.backgroundColor = '#B05625'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#F05E16'}>
              Confirmar
            </button>
            <button style={{ width: "150px"}} color="secondary"  onClick={() => this.setState({ modalEliminar: false, participanteAEliminar: null })}>
              Cancelar
            </button>
          </ModalFooter>
        </Modal>
      </>
      </div>
      </div>
    );
  }
}

export default CRUDParticipantes;
