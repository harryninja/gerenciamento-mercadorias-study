import { useState, useEffect } from "react";
import axios from "axios";
import { TextField, Button, MenuItem, Container, Typography } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EntradaForm = () => {
  const [entrada, setEntrada] = useState({
    mercadoria_id: "",
    quantidade: "",
    data_hora: "",
    local: "",
  });

  const [mercadorias, setMercadorias] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/mercadorias")
      .then((res) => {
        const mercadoriasFormatadas = res.data.mercadorias.map(m => ({
            id: m.id || m.id_mercadoria,
            nome: m.nome,
            numero_registro: m.numero_registro,
            fabricante: m.fabricante,
            tipo: m.tipo
        }));

        setMercadorias(mercadoriasFormatadas);
      })
      .catch((err) => toast.error("Erro ao carregar mercadorias!"));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/entradas", entrada);
      toast.success("Entrada registrada com sucesso!");
      setEntrada({ mercadoria_id: "", quantidade: "", data_hora: "", local: "" });
    } catch (error) {
      toast.error("Erro ao registrar entrada!");
    }
  };

  return (
    <Container maxWidth="sm">
      <ToastContainer />
      <Typography variant="h5">Registrar Entrada</Typography>
      <form onSubmit={handleSubmit}>
        <TextField fullWidth select label="Mercadoria" margin="normal"
          value={entrada.mercadoria_id}
          onChange={(e) => setEntrada({ ...entrada, mercadoria_id: e.target.value })}
          required>
          {mercadorias.map((m) => (
            <MenuItem key={m.id} value={m.id}>{m.nome}</MenuItem>
          ))}
        </TextField>

        <TextField fullWidth label="Quantidade" type="number" margin="normal"
          value={entrada.quantidade}
          onChange={(e) => setEntrada({ ...entrada, quantidade: e.target.value })}
          required />

        <TextField fullWidth type="datetime-local" margin="normal"
          value={entrada.data_hora}
          onChange={(e) => setEntrada({ ...entrada, data_hora: e.target.value })}
          required />

        <TextField fullWidth label="Local" margin="normal"
          value={entrada.local}
          onChange={(e) => setEntrada({ ...entrada, local: e.target.value })}
          required />

        <Button type="submit" variant="contained" color="primary">Registrar</Button>
      </form>
    </Container>
  );
};

export default EntradaForm;
