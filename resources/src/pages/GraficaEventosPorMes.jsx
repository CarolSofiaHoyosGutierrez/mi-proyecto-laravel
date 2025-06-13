import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const GraficaEventosPorMes = () => {
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/reportes/eventos-por-mes")
      .then((res) => {
        const formateados = res.data.map((item) => {
        const [año, mes] = item.mes.split("-");
        const fecha = new Date(`${año}-${mes}-01`);
        const nombreMes = fecha.toLocaleDateString("es-ES", { month: "long", year: "numeric" });
        return {
        mes: nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1), // Capitalizar
        total: item.total_eventos,
    };
    });

        setDatos(formateados);
      })
      .catch((err) => {
        console.error("Error al obtener eventos por mes:", err);
      });
  }, []);

  return (
    <div style={{ width: "100%", height: 300 }}>
      <h2 style={{ textAlign: "center" }}>Eventos por Mes</h2>
      <ResponsiveContainer>
        <BarChart data={datos} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mes" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="total" fill="#4B9CD3" name="Eventos" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraficaEventosPorMes;
