import { useState } from "react";
import { TextField, Button, Container, Typography } from "@mui/material";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MercadoriaForm = () => {
  const [mercadoria, setMercadoria] = useState({
    nome: "",
    numero_registro: "",
    fabricante: "",
    tipo: "",
    descricao: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/mercadorias", mercadoria);
      toast.success("Mercadoria cadastrada com sucesso!");
    } catch (error) {
      toast.error("Erro ao cadastrar mercadoria!");
    }
  };

  return (
    <Container maxWidth="sm">
      <ToastContainer />
      <Typography variant="h5">Cadastro de Mercadoria</Typography>
      <form onSubmit={handleSubmit}>
        <TextField fullWidth label="Nome" margin="normal" onChange={(e) => setMercadoria({ ...mercadoria, nome: e.target.value })} required />
        <TextField fullWidth label="Número de Registro" margin="normal" onChange={(e) => setMercadoria({ ...mercadoria, numero_registro: e.target.value })} required />
        <TextField fullWidth label="Fabricante" margin="normal" onChange={(e) => setMercadoria({ ...mercadoria, fabricante: e.target.value })} required />
        <TextField fullWidth label="Tipo" margin="normal" onChange={(e) => setMercadoria({ ...mercadoria, tipo: e.target.value })} required />
        <TextField fullWidth label="Descrição" multiline rows={4} margin="normal" onChange={(e) => setMercadoria({ ...mercadoria, descricao: e.target.value })} />
        <Button type="submit" variant="contained" color="primary">Cadastrar</Button>
      </form>
    </Container>
  );
};

export default MercadoriaForm;
