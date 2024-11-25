import React from "react";
import "./VistaStand.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Table, Container, Input, FormGroup, Button } from "reactstrap";
import "react-datepicker/dist/react-datepicker.css";
import iconoJuego1 from "./iconos/iconoJuego1.png";
import iconoJuego2 from "./iconos/iconoJuego2.png";

class VistaStand extends React.Component {
  state = {
    data: [],
    dataFiltrada: [],
    busqueda: "",
  };

  // Método del ciclo de vida de React: se ejecuta después de montar el componente.
  // Realiza una solicitud al servidor para obtener datos de los stands.
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

  // Método para manejar cambios en el campo de búsqueda.
  // Actualiza el estado con el texto ingresado y llama a la función de filtrado.
  handleChangeBuscar = async (e) => {
    e.persist();
    await this.setState({ busqueda: e.target.value });
    this.filtrarElementos();
  };

  // Filtra los elementos de la lista basándose en el texto de búsqueda.
  filtrarElementos = () => {
    var search = this.state.dataFiltrada.filter((item) => {
      const estadoTexto = item.estado ? "reservado" : "libre";
      return (
        item.noStand.toString().includes(this.state.busqueda) ||
        item.nombre
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .includes(this.state.busqueda.toLowerCase()) ||
        item.ubicacion
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .includes(this.state.busqueda.toLowerCase()) ||
        item.fechahora
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .includes(this.state.busqueda.toLowerCase()) ||
        estadoTexto.toLowerCase().includes(this.state.busqueda.toLowerCase())
      );
    });
    this.setState({ data: search });
  };

  // Navega de regreso a la página anterior usando el historial del navegador.
  goBack = () => {
    window.history.back();
  };

  //Render del componente principal
  render() {
    return (
      <div className="VistaStand body">
        <Container className="container">
          <Button
            color="primary"
            className="button goBack"
            onClick={this.goBack}
          >
            Regresar
          </Button>
          <h1>
            <img
              src={iconoJuego1}
              alt="Icono de juegos"
              style={{ height: "100px", marginRight: "20px" }}
            />
            Stands
            <img
              src={iconoJuego2}
              alt="Icono de juegos"
              style={{ height: "100px", marginLeft: "10px" }}
            />
          </h1>
          <div
            className="barraBusqueda"
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginRight: "20px",
            }}
          >
            <FormGroup className="d-flex align-items-center">
              <img
                src="lupa.png"
                alt="Ícono de búsqueda"
                style={{ height: "26px", marginRight: "10px" }}
              />
              <Input
                type="text"
                placeholder="Buscar"
                className="textField"
                name="busqueda"
                value={this.state.busqueda}
                onChange={this.handleChangeBuscar}
                style={{ width: "200px" }}
              />
            </FormGroup>
          </div>
          <Table>
            <thead>
              <tr>
                <th>No. Stand</th>
                <th>Nombre</th>
                <th>Ubicación</th>
                <th>Fecha y hora de registro</th>
                <th>Estado</th>
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
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>
      </div>
    );
  }
}

export default VistaStand;
