import { useState, useEffect } from "react";
import axios from "axios";
import { TextField, Button, MenuItem, Container, Typography } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SaidaForm = () => {
  const [saida, setSaida] = useState({
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
      .catch(() => toast.error("Erro ao carregar mercadorias!"));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/saidas", saida);
      toast.success("Saída registrada com sucesso!");
      setSaida({ mercadoria_id: "", quantidade: "", data_hora: "", local: "" });
    } catch (error) {
      toast.error("Erro ao registrar saída!");
    }
  };

  return (
    <Container maxWidth="sm">
      <ToastContainer />
      <Typography variant="h5">Registrar Saída</Typography>
      <form onSubmit={handleSubmit}>
        <TextField fullWidth select label="Mercadoria" margin="normal"
          value={saida.mercadoria_id}
          onChange={(e) => setSaida({ ...saida, mercadoria_id: e.target.value })}
          required>
          {mercadorias.map((m) => (
            <MenuItem key={m.id} value={m.id}>{m.nome}</MenuItem>
          ))}
        </TextField>

        <TextField fullWidth label="Quantidade" type="number" margin="normal"
          value={saida.quantidade}
          onChange={(e) => setSaida({ ...saida, quantidade: e.target.value })}
          required />

        <TextField fullWidth type="datetime-local" margin="normal"
          value={saida.data_hora}
          onChange={(e) => setSaida({ ...saida, data_hora: e.target.value })}
          required />

        <TextField fullWidth label="Local" margin="normal"
          value={saida.local}
          onChange={(e) => setSaida({ ...saida, local: e.target.value })}
          required />

        <Button type="submit" variant="contained" color="primary">Registrar</Button>
      </form>
    </Container>
  );
};

export default SaidaForm;
