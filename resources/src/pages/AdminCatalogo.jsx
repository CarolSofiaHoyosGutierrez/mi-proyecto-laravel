import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import '../styles/AdminCatalogo.css';

const AdminCatalogo = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("auth-token");
  const rol = localStorage.getItem("rol");

  if (!token || rol !== "administrador") {
    navigate("/login");
    return null;
  }

  const [inventarios, setInventarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [editarProducto, setEditarProducto] = useState(null); // null si no hay edición
  const [nuevoInventario, setNuevoInventario] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    imagen: null,
  });

  useEffect(() => {
    cargarInventarios();
  }, []);

   // ✅ Este useEffect precarga los datos al editar
  useEffect(() => {
    if (editarProducto) {
      setNuevoInventario({
        nombre: editarProducto.nombre,
        descripcion: editarProducto.descripcion,
        precio: editarProducto.precio,
        imagen: null, // No se precarga imagen
      });
    }
  }, [editarProducto]);

  const cargarInventarios = () => {
    axios.get("http://localhost:8000/api/inventarios", {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then((res) => {
      setInventarios(res.data);
      setCargando(false);
    })
    .catch((err) => {
      console.error("Error al cargar inventarios", err);
      setCargando(false);
    });
  };

  const handleCrearInventario = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("nombre", nuevoInventario.nombre);
    formData.append("descripcion", nuevoInventario.descripcion);
    formData.append("precio", parseFloat(nuevoInventario.precio));
    if (nuevoInventario.imagen) {
      formData.append("imagen", nuevoInventario.imagen);
    }

    try {
      if (editarProducto) {
      await axios.post(`http://localhost:8000/api/inventario/${editarProducto.id}?_method=PUT`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      alert("Producto actualizado");
    } else {
      // Crear nuevo producto
      await axios.post("http://localhost:8000/api/inventarios", formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      });
      alert('Producto creado con éxito');
    }
      setMostrarModal(false);
      setNuevoInventario({ nombre: "", descripcion: "", precio: "", imagen: null });
      cargarInventarios();
    } catch (error) {
      console.error("Error al crear producto", error);
      alert("Error al crear el producto");
    }
  };

  const handleEditarClick = (producto) => {
  setEditarProducto(producto);
  setMostrarModal(true);
};

  const handleEliminarProducto = async (id) => {
  if (!window.confirm("¿Estás seguro de eliminar este producto?")) return;

  try {
    await axios.delete(`http://localhost:8000/api/inventario/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    alert("Producto eliminado");
    cargarInventarios();
  } catch (error) {
    console.error("Error al eliminar producto", error);
    alert("No se pudo eliminar el producto");
  }
};


  return (
    <div className="admin-page">
      <header className="admin-header">
        <h1>Administrador de Productos</h1>
        <button className="btn-nuevo"
         onClick={() => {
          setNuevoInventario({ nombre: "", descripcion: "", precio: "", imagen: null });
          setEditarProducto(null);
          setMostrarModal(true);}}>+ Nuevo Producto</button>
      </header>

      {cargando ? (
        <p className="loading-text">Cargando productos...</p>
      ) : (
        <section className="product-grid">
          {inventarios.map((item) => (
            <div key={item.id} className="product-card">
              <img
                src={`http://localhost:8000/storage/${item.imagen}`}
                alt={item.nombre}
                className="product-img"
              />
              <div className="product-info">
                <h3>{item.nombre}</h3>
                <p>{item.descripcion}</p>
                <span className="price-tag">${item.precio}</span>
              </div>
              <div className="admin-actions">
              <button onClick={() => handleEditarClick(item)} className="btn-editar">Editar</button>
              <button onClick={() => handleEliminarProducto(item.id)} className="btn-eliminar">Eliminar</button>
              </div>
            </div>
          ))}
        </section>
      )}

      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal-form">
            <h2>Registrar nuevo producto</h2>
            <form onSubmit={handleCrearInventario}>
              <input
                type="text"
                placeholder="Nombre"
                value={nuevoInventario.nombre}
                onChange={(e) => setNuevoInventario({ ...nuevoInventario, nombre: e.target.value })}
                required
              />
              <textarea
                placeholder="Descripción"
                value={nuevoInventario.descripcion}
                onChange={(e) => setNuevoInventario({ ...nuevoInventario, descripcion: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Precio"
                value={nuevoInventario.precio}
                onChange={(e) => setNuevoInventario({ ...nuevoInventario, precio: e.target.value })}
                required
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setNuevoInventario({ ...nuevoInventario, imagen: e.target.files[0] })}
              />
              <div className="modal-actions">
                <button type="button" onClick={() => setMostrarModal(false)} className="btn-cancelar">Cancelar</button>
                <button type="submit" className="btn-guardar">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCatalogo;
