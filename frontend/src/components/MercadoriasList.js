import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Typography, Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MercadoriasList = () => {
  const [mercadorias, setMercadorias] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/mercadorias")
      .then((res) => setMercadorias(res.data.mercadorias))
      .catch(() => toast.error("Erro ao carregar mercadorias!"));
  }, []);

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "nome", headerName: "Nome", width: 200 },
    { field: "numero_registro", headerName: "Registro", width: 150 },
    { field: "fabricante", headerName: "Fabricante", width: 200 },
    { field: "tipo", headerName: "Tipo", width: 150 },
    { field: "descricao", headerName: "Descrição", width: 250 },
  ];

  return (
    <Container>
      <ToastContainer />
      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h4" gutterBottom>Mercadorias Cadastradas</Typography>
        <DataGrid rows={mercadorias} columns={columns} pageSize={5} autoHeight />
      </Paper>
    </Container>
  );
};

export default MercadoriasList;
