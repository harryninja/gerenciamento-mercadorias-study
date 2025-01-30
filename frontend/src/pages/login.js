import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../src/auth/AuthService";
import { TextField, Button, Container, Typography } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, senha);
      toast.success("Login realizado com sucesso!");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Erro ao fazer login. Verifique suas credenciais.");
    }
  };

  return (
    <Container maxWidth="sm">
      <ToastContainer />
      <Typography variant="h5">Login</Typography>
      <form onSubmit={handleLogin}>
        <TextField fullWidth label="Email" type="email" margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required />

        <TextField fullWidth label="Senha" type="password" margin="normal"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required />

        <Button type="submit" variant="contained" color="primary">Entrar</Button>
      </form>
    </Container>
  );
};

export default Login;
