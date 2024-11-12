import React from "react";
import "./VistaStand.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Table, Container, Input, FormGroup } from "reactstrap";
import "react-datepicker/dist/react-datepicker.css";
import iconoJuego1 from "./iconos/iconoJuego1.png";
import iconoJuego2 from "./iconos/iconoJuego2.png";

class VistaStand extends React.Component {
  state = {
    data: [],
    dataFiltrada: [],
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

  handleChangeBuscar = async (e) => {
    e.persist();
    await this.setState({ busqueda: e.target.value });
    this.filtrarElementos();
  }

  filtrarElementos = () => {
    var search = this.state.dataFiltrada.filter(item => {
      const estadoTexto = item.estado ? "reservado" : "libre";
      return (
        item.noStand.toString().includes(this.state.busqueda) ||        
        item.nombre.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").includes(this.state.busqueda.toLowerCase()) ||
        item.ubicacion.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").includes(this.state.busqueda.toLowerCase()) ||
        item.fechahora.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").includes(this.state.busqueda.toLowerCase()) ||
        estadoTexto.toLowerCase().includes(this.state.busqueda.toLowerCase())
      );
    });
    this.setState({ data: search });
  }

  render() {
    return (
      <>
      <h1>  
        <img src={iconoJuego1} alt="Icono de juegos" style={{ height: '100px', marginRight: '20px' }} />
        Stands
        <img src={iconoJuego2} alt="Icono de juegos" style={{ height: '100px', marginLeft: '10px' }} /></h1>

        <Container className="VistaStand">
          <br />
          <div className="barraBusqueda" style={{ display: 'flex', justifyContent: 'flex-end', marginRight: '20px' }}>
            <FormGroup className="d-flex align-items-center">
              <img
                src="lupa.png"
                alt="Ícono de búsqueda"
                style={{ height: '26px', marginRight: '10px' }}
              />
             <Input
              type="text"
              placeholder="Buscar"
              className="textField"
              name="busqueda"
              value={this.state.busqueda}
              onChange={this.handleChangeBuscar}
              style={{ width: '200px' }} // Ajusta según sea necesario
            />
            </FormGroup>
          </div>
          <br />
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
                  <th>{dato.estado ? "reservado" : "libre"}</th>
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>
      </>
    );
  }

}

export default VistaStand;