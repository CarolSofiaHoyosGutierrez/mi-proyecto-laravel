import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

const GraficaInscritosPorEvento = () => {
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/api/reportes/inscritos-por-evento")
      .then((res) => {
        setDatos(res.data);
      })
      .catch((err) => {
        console.error("Error cargando datos:", err);
      });
  }, []);

  return (
    <div style={{ width: "100%", height: 400 }}>
      <h2>📊 Inscritos por Evento</h2>
      <ResponsiveContainer>
        <BarChart data={datos} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="evento" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="inscritos" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraficaInscritosPorEvento;
