import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/EventosAdmin.css";
import GraficaInscritosPorEvento from "../pages/GraficaInscritosPorEvento";
import GraficaEventosPorMes from "../pages/GraficaEventosPorMes";

const EventosAdmin = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("auth-token");
  const rol = localStorage.getItem("rol");

  if (!token || rol !== "administrador") {
    navigate("/login");
    return null;
  }

  const [mostrarGrafica, setMostrarGrafica] = useState(false);
  const [eventos, setEventos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [editarEvento, setEditarEvento] = useState(null);
  const [nuevoEvento, setNuevoEvento] = useState({
    nombre: "",
    fecha: "",
    lugar: "",
    cupo: "",
  });

  useEffect(() => {
    cargarEventos();
  }, []);

  useEffect(() => {
  if (editarEvento) {
    setNuevoEvento({
      nombre: editarEvento.nombre,
      fecha: editarEvento.fecha,
      lugar: editarEvento.lugar,
      cupo: editarEvento.cupo,
    });
    setMostrarModal(true);
  }
}, [editarEvento]);


  const cargarEventos = () => {
    axios.get("http://localhost:8000/api/eventos")
      .then((res) => {
        console.log("Eventos cargados:", res.data); // 🔍 Verifica aquí
        setEventos(res.data);
        setCargando(false);
      })
      .catch((err) => {
        console.error("Error al cargar eventos", err);
        setCargando(false);
      });
  };

  const handleGuardarEvento = async (e) => {
  e.preventDefault();

  try {
    if (editarEvento) {
      // Actualizar evento
      await axios.put(`http://localhost:8000/api/eventos/${editarEvento.id}`, nuevoEvento,
         {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
    },
  }
      );
      alert("Evento actualizado correctamente");
    } else {
      // Crear nuevo evento
      await axios.post("http://localhost:8000/api/eventos", nuevoEvento,
        {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
    },
  }
      );
      alert("Evento creado exitosamente");
    }

    setMostrarModal(false);
    setNuevoEvento({ nombre: "", fecha: "", lugar: "", cupo: "" });
    setEditarEvento(null);
    cargarEventos();
  } catch (err) {
    console.error("Error al guardar evento", err);
    alert("Ocurrió un error al guardar el evento");
  }
};

const handleEliminarEvento = async (id) => {
  if (!window.confirm("¿Estás seguro de eliminar este evento?")) return;

  try {
    await axios.delete(`http://localhost:8000/api/eventos/${id}`);
    alert("Evento eliminado");
    cargarEventos();
  } catch (error) {
    console.error("Error al eliminar evento", error);
    alert("No se pudo eliminar el evento");
  }
};



  {/*const handleCrearEvento = (e) => {
    e.preventDefault();
    axios.post("http://localhost:8000/api/eventos", nuevoEvento)
      .then(() => {
        setMostrarModal(false);
        setNuevoEvento({ nombre: "", fecha: "", lugar: "", cupo: "" });
        cargarEventos();
      })
      .catch((err) => console.error("Error al crear evento", err));
  };*/}

  const eventosFiltrados = eventos.filter((evento) => {
    const porcentaje = evento.cupo > 0 ? (evento.inscritos / evento.cupo) * 100 : 0;
    let estado = "disponible";
    if (porcentaje >= 100) estado = "lleno";
    else if (porcentaje < 30) estado = "baja-asistencia";
    return filtroEstado === "todos" || estado === filtroEstado;
  });

  return (
    <div className="eventos-admin-container">
      <header className="eventos-header">
        <h1>Gestión de Eventos</h1>
        <div className="grafica-eventos">
          <GraficaEventosPorMes />
        </div>
        <div className="filtro-estado">
          <label>Filtrar por estado: </label>
          <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
            <option value="todos">Todos</option>
            <option value="lleno">Lleno</option>
            <option value="baja-asistencia">Baja asistencia</option>
            <option value="disponible">Disponible</option>
          </select>
        </div>
        <button className="btn-nuevo-evento" onClick={() => setMostrarModal(true)}>+ Nuevo Evento</button>
        <button className="btn-reportes" onClick={() => setMostrarGrafica(!mostrarGrafica)}>
          📊 {mostrarGrafica ? "Ocultar Reportes" : "Ver Reportes"}
        </button>
      </header>

      {cargando ? (
        <p className="loading-text">Cargando eventos...</p>
      ) : (
        <section className="eventos-grid">
          {eventosFiltrados.map((evento) => {
            const porcentaje = evento.cupo > 0 ? (evento.inscritos / evento.cupo) * 100 : 0;
            let estado = "Disponible";
            if (porcentaje >= 100) estado = "Lleno";
            else if (porcentaje < 30) estado = "Baja asistencia";

            return (
              <div className="evento-card" key={evento.id}>
                <h3>{evento.nombre}</h3>
                <p><strong>Fecha:</strong> {evento.fecha}</p>
                <p><strong>Lugar:</strong> {evento.lugar}</p>
                <p><strong>Cupo:</strong> {evento.cupo}</p>
                <p><strong>Inscritos:</strong> {evento.inscritos}</p>
                <p className={`estado-evento ${estado.toLowerCase().replace(" ", "-")}`}>
                  <strong>Estado:</strong> {estado}
                </p>
                <div className="barra-ocupacion">
                  <div
                    className="progreso"
                    style={{
                      width: `${porcentaje}%`,
                      backgroundColor:
                        estado === "Lleno" ? "red" :
                        estado === "Baja asistencia" ? "orange" :
                        "green",
                    }}
                  >
                    {Math.round(porcentaje)}%
                  </div>
                </div>
                <div className="admin-actions">
  <button onClick={() => setEditarEvento(evento)} className="btn-editar">Editar</button>
  <button onClick={() => handleEliminarEvento(evento.id)} className="btn-eliminar">Eliminar</button>
</div>

              </div>
            );
          })}
        </section>
      )}

      {mostrarGrafica && (
        <div className="grafica-container">
          <GraficaInscritosPorEvento />
        </div>
      )}

      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal-form">
            <h2>Registrar nuevo evento</h2>
            <form onSubmit={handleGuardarEvento}>
              <input
                type="text"
                placeholder="Nombre del evento"
                value={nuevoEvento.nombre}
                onChange={(e) => setNuevoEvento({ ...nuevoEvento, nombre: e.target.value })}
                required
              />
              <input
                type="date"
                value={nuevoEvento.fecha}
                onChange={(e) => setNuevoEvento({ ...nuevoEvento, fecha: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Lugar"
                value={nuevoEvento.lugar}
                onChange={(e) => setNuevoEvento({ ...nuevoEvento, lugar: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Cupo máximo"
                value={nuevoEvento.cupo}
                onChange={(e) => setNuevoEvento({ ...nuevoEvento, cupo: e.target.value })}
                required
              />
              <div className="modal-actions">
                <button type="button" className="btn-cancelar" onClick={() => setMostrarModal(false)}>Cancelar</button>
                <button type="submit" className="btn-guardar">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventosAdmin;

{/*import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/EventosAdmin.css";
import GraficaInscritosPorEvento from "../pages/GraficaInscritosPorEvento";
import GraficaEventosPorMes from "../pages/GraficaEventosPorMes";

const EventosAdmin = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("auth-token");
  const rol = localStorage.getItem("rol");

  if (!token || rol !== "administrador") {
    navigate("/login");
    return null;
  }

  const [mostrarGrafica, setMostrarGrafica] = useState(false);
  const [eventos, setEventos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoEvento, setNuevoEvento] = useState({
    nombre: "",
    fecha: "",
    lugar: "",
    cupo: "",
  });

  useEffect(() => {
    cargarEventos();
  }, []);

  const cargarEventos = () => {
    axios.get("http://localhost:8000/api/eventos")
      .then((res) => {
        setEventos(res.data);
        setCargando(false);
      })
      .catch((err) => {
        console.error("Error al cargar eventos", err);
        setCargando(false);
      });
  };

  const handleCrearEvento = (e) => {
    e.preventDefault();
    axios.post("http://localhost:8000/api/eventos", nuevoEvento)
      .then(() => {
        setMostrarModal(false);
        setNuevoEvento({ nombre: "", fecha: "", lugar: "" });
        cargarEventos();
      })
      .catch((err) => console.error("Error al crear evento", err));
  };

  return (
    <div className="eventos-admin-container">
      <header className="eventos-header">
        <h1>Gestión de Eventos</h1>
        <div className="grafica-eventos">
        <GraficaEventosPorMes />
        </div>
        <button className="btn-nuevo-evento" onClick={() => setMostrarModal(true)}>+ Nuevo Evento</button>
        <button className="btn-reportes" onClick={() => setMostrarGrafica(!mostrarGrafica)}>
  📊 {mostrarGrafica ? "Ocultar Reportes" : "Ver Reportes"}
</button>

      </header>

      {cargando ? (
        <p className="loading-text">Cargando eventos...</p>
      ) : (
        <section className="eventos-grid">
            {eventos.map((evento) => {
    const porcentaje = evento.cupo > 0 ? (evento.inscritos / evento.cupo) * 100 : 0;

    let estado = "Disponible";
    if (porcentaje >= 100) {
      estado = "Lleno";
    } else if (porcentaje < 30) {
      estado = "Baja asistencia";
    }

    return (
      <div className="evento-card" key={evento.id}>
        <h3>{evento.nombre}</h3>
        <p><strong>Fecha:</strong> {evento.fecha}</p>
        <p><strong>Lugar:</strong> {evento.lugar}</p>
        <p><strong>Cupo:</strong> {evento.cupo}</p>
        <p><strong>Inscritos:</strong> {evento.inscritos}</p>
        <p className={`estado-evento ${estado.toLowerCase().replace(" ", "-")}`}>
          <strong>Estado:</strong> {estado}
        </p>
        <div className="barra-ocupacion">
    <div
    className="progreso"
    style={{ width: `${porcentaje}%`, backgroundColor: estado === "Lleno" ? "red" : estado === "Baja asistencia" ? "orange" : "green" }}
    >
    {Math.round(porcentaje)}%
    </div>
    </div>
    </div>
    );
  })}

          {/*{eventos.map((evento) => (
            <div className="evento-card" key={evento.id}>
              <h3>{evento.nombre}</h3>
              <p><strong>Fecha:</strong> {evento.fecha}</p>
              <p><strong>Lugar:</strong> {evento.lugar}</p>
            </div>
          ))}*/}
        {/*</section>
      )}

      {mostrarGrafica && (
  <div className="grafica-container">
    <GraficaInscritosPorEvento />
  </div>
)}


      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal-form">
            <h2>Registrar nuevo evento</h2>
            <form onSubmit={handleCrearEvento}>
              <input
                type="text"
                placeholder="Nombre del evento"
                value={nuevoEvento.nombre}
                onChange={(e) => setNuevoEvento({ ...nuevoEvento, nombre: e.target.value })}
                required
              />
              <input
                type="date"
                value={nuevoEvento.fecha}
                onChange={(e) => setNuevoEvento({ ...nuevoEvento, fecha: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Lugar"
                value={nuevoEvento.lugar}
                onChange={(e) => setNuevoEvento({ ...nuevoEvento, lugar: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Cupo máximo"
                value={nuevoEvento.cupo}
                onChange={(e) =>
                  setNuevoEvento({ ...nuevoEvento, cupo: e.target.value })
                }
                required
              />
              <div className="modal-actions">
                <button type="button" className="btn-cancelar" onClick={() => setMostrarModal(false)}>Cancelar</button>
                <button type="submit" className="btn-guardar">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventosAdmin;*/}


{/*import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/pages/ui/button";
import { Card, CardContent } from "@/pages/ui/card";

const EventosAdmin = () => {
  const [eventos, setEventos] = useState([]);
  const [cargando, setCargando] = useState(true);


  // Simulación de carga inicial (luego lo conectamos al backend)
  useEffect(() => {
    axios.get("http://localhost:8000/api/eventos")
      .then((res) => {
        setEventos(res.data);
        setCargando(false);
      })
      .catch((err) => {
        console.error("Error al cargar eventos", err);
        setCargando(false);
      });
    
    const eventosDummy = [
      { id: 1, nombre: "Feria de Ciencia", fecha: "2025-05-10", lugar: "Auditorio Central" },
      { id: 2, nombre: "Hackathon RECIENCIA", fecha: "2025-06-01", lugar: "Sala 2" },
    ];
    setEventos(eventosDummy);
  }, []);

  const handleEditar = (id) => {
    console.log("Editar evento", id);
    // lógica de navegación o abrir modal
  };

  const handleEliminar = (id) => {
    console.log("Eliminar evento", id);
    // lógica de confirmación y eliminación
  };

  const handleCrearNuevo = () => {
    console.log("Crear nuevo evento");
    // lógica para abrir formulario o redirigir
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Eventos</h1>

      <Button className="mb-4" onClick={handleCrearNuevo}>
        Crear nuevo evento
      </Button>

      <Card>
        <CardContent className="overflow-x-auto p-4">
          <table className="min-w-full table-auto border">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Nombre</th>
                <th className="px-4 py-2 text-left">Fecha</th>
                <th className="px-4 py-2 text-left">Lugar</th>
                <th className="px-4 py-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {eventos.map((evento) => (
                <tr key={evento.id} className="border-t">
                  <td className="px-4 py-2">{evento.nombre}</td>
                  <td className="px-4 py-2">{evento.fecha}</td>
                  <td className="px-4 py-2">{evento.lugar}</td>
                  <td className="px-4 py-2">
                    <Button className="mr-2" onClick={() => handleEditar(evento.id)}>
                      Editar
                    </Button>
                    <Button variant="destructive" onClick={() => handleEliminar(evento.id)}>
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
              {eventos.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-4">
                    No hay eventos registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventosAdmin;*/}
