import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaCamera, FaSave, FaTimes, FaUserEdit, FaUserShield, FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import '../styles/UserProfile.css'

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({});
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const token = localStorage.getItem("auth-token");

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/perfil", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser(res.data);
        setForm({ ...res.data, contraseña: "" });
      })
      .catch((err) => console.error("Error al obtener perfil:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, imagen_perfil: file });
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    ["nombre", "apellido", "correo", "telefono", "contraseña"].forEach((key) => {
      if (form[key]) formData.append(key, form[key]);
    });
    if (form.imagen_perfil instanceof File) {
      formData.append("imagen_perfil", form.imagen_perfil);
    }

    try {
      const res = await axios.post(
        "http://localhost:8000/api/perfil?_method=PUT",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("✔️ Perfil actualizado correctamente");
      setUser(res.data);
      setEditMode(false);
      setPreview(null);
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      alert("❌ Ocurrió un error al actualizar el perfil");
    } finally {
      setLoading(false);
    }
  };

  if (!user)
    return <p className="text-center mt-10 text-gray-600 animate-pulse">Cargando perfil...</p>;

  return (
    <div className="profile-background">
      <div className="profile-card">
        <div className="relative">
          <img
            src={
              preview
                ? preview
                : user.imagen_perfil
                ? `http://localhost:8000/storage/imagenes/${user.imagen_perfil}`
                :  `https://ui-avatars.com/api/?name=${user.nombre}+${user.apellido}&background=ffffff&color=&size=140&rounded=true`
            }
            alt="Perfil foto"
            className="profile-avatar"
          />
          {editMode && (
            <label className="absolute bottom-0 right-0 p-2 bg-red-600 text-white rounded-full cursor-pointer">
              <FaCamera />
              <input type="file" name="imagen_perfil" onChange={handleFileChange} className="hidden" />
            </label>
          )}
        </div>

        {!editMode && (
          <div className="text-center mt-4">
            <h2 className="text-3xl font-bold text-gray-800">
              {user.nombre} {user.apellido}
            </h2>
            <p className="text-gray-600 mt-1"><FaEnvelope/> {user.correo}</p>
            <p className="text-gray-600"><FaPhoneAlt/> {user.telefono}</p>
            <p><FaUserShield></FaUserShield></p>
            <p className="user-role-badge">{user.rol}</p>
            <button
              onClick={() => setEditMode(true)}
              className="btn-guardar"
            >
              <FaUserEdit className="icono-btn"/> Editar perfil
            </button>
          </div>
        )}
      </div>

      {editMode && (
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold">Nombre</label>
              <input
                type="text"
                name="nombre"
                value={form.nombre || ""}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">Apellido</label>
              <input
                type="text"
                name="apellido"
                value={form.apellido || ""}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">Correo</label>
              <input
                type="email"
                name="correo"
                value={form.correo || ""}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">Teléfono</label>
              <input
                type="text"
                name="telefono"
                value={form.telefono || ""}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold">Contraseña (opcional)</label>
              <input
                type="password"
                name="contraseña"
                onChange={handleChange}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>
          <div className="flex justify-between mt-6">
            <button
              type="submit"
              className="bg-green-600 text-white px-5 py-2 rounded-full flex items-center gap-2 hover:bg-green-700"
              disabled={loading}
            >
              <FaSave /> {loading ? "Guardando..." : "Guardar Cambios"}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditMode(false);
                setForm(user);
                setPreview(null);
              }}
              className="bg-gray-500 text-white px-5 py-2 rounded-full flex items-center gap-2 hover:bg-gray-600"
            >
              <FaTimes /> Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

{/*
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({});
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const token = localStorage.getItem("auth-token");

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/perfil", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser(res.data);
        setForm({
          ...res.data,
          contraseña: "",
      });
      })
      .catch((err) => {
        console.error("Error al obtener perfil:", err);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, imagen_perfil: file });

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
     e.preventDefault();
  setLoading(true);

  console.log("📦 Lo que estás a punto de enviar (form):", form);

  const formData = new FormData();

  // Campos normales
  if (form.nombre) formData.append("nombre", form.nombre);
  if (form.apellido) formData.append("apellido", form.apellido);
  if (form.correo) formData.append("correo", form.correo);
  if (form.telefono) formData.append("telefono", form.telefono);

  // Contraseña si se ingresó
  if (form.contraseña) formData.append("contraseña", form.contraseña);

  // Imagen si se subió
  if (form.imagen_perfil instanceof File) {
    formData.append("imagen_perfil", form.imagen_perfil);
  }

  // DEBUG: Mostrar contenido de formData
  for (let [key, value] of formData.entries()) {
    console.log(`🧾 ${key}:`, value);
  }

  try {
    const res = await axios.post("http://localhost:8000/api/perfil?_method=PUT", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("✅ Respuesta:", res.data);
    alert("Perfil actualizado correctamente");
    setUser(res.data);
    setEditMode(false);
    setPreview(null);
  } catch (error) {
    console.error("❌ Error al actualizar perfil:", error);
    alert("Ocurrió un error al actualizar el perfil");
  } finally {
    setLoading(false);
  }
  };

  if (!user) return <p className="text-center mt-10">Cargando perfil...</p>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow mt-10">
      <div className="flex flex-col items-center">
        <img
          src={
            preview
              ? preview
              : user.imagen_perfil
              ? `http://localhost:8000/storage/perfiles/${user.imagen_perfil}`
              : "https://via.placeholder.com/150"
          }
          alt="Perfil"
          className="w-32 h-32 object-cover rounded-full mb-4"
        />
        {!editMode && (
          <>
            <h2 className="text-2xl font-bold mb-2">
              {user.nombre} {user.apellido}
            </h2>
            <p className="text-gray-700 mb-1"><strong>Correo:</strong> {user.correo}</p>
            <p className="text-gray-700 mb-1"><strong>Teléfono:</strong> {user.telefono}</p>
            <button
              onClick={() => setEditMode(true)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Editar perfil
            </button>
          </>
        )}
      </div>

      {editMode && (
        <form onSubmit={handleSubmit} className="space-y-4 mt-6" encType="multipart/form-data">
          <div>
            <label className="block font-medium">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={form.nombre || ''}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block font-medium">Apellido</label>
            <input
              type="text"
              name="apellido"
              value={form.apellido || ''}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block font-medium">Correo</label>
            <input
              type="email"
              name="correo"
              value={form.correo || ''}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block font-medium">Teléfono</label>
            <input
              type="text"
              name="telefono"
              value={form.telefono || ''}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block font-medium">Contraseña (opcional)</label>
            <input
              type="password"
              name="contraseña"
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block font-medium">Imagen de perfil</label>
            <input
              type="file"
              name="imagen_perfil"
              onChange={handleFileChange}
              accept="image/*"
              className="w-full"
            />
          </div>
          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              disabled={loading}
            >
              {loading ? "Guardando..." : "Guardar Cambios"}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditMode(false);
                setForm(user);
                setPreview(null);
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
}*/}
