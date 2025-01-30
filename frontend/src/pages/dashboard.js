import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getToken, logout } from "../../src/auth/AuthService";
import { Container, Typography, Button, Box, Grid, Paper, Tabs, Tab } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MercadoriaForm from "../../src/components/MercadoriaForm";
import EntradaForm from "../../src/components/EntradaForm";
import SaidaForm from "../../src/components/SaidaForm";
import GraficoMovimentacao from "../../src/components/GraficoMovimentacao";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";

const Dashboard = () => {
    const navigate = useNavigate();
    const [mercadorias, setMercadorias] = useState([]);
    const [abaAtual, setAbaAtual] = useState(0);

    useEffect(() => {
        axios.get("http://localhost:5000/mercadorias", { headers: { Authorization: `Bearer ${getToken()}` } })
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
            .catch((error) => {
                console.error("Erro ao carregar mercadorias:", error);
                toast.error("Erro ao carregar mercadorias!");
            });
    }, []);

    const handleLogout = () => {
        logout();
        toast.info("Logout realizado!");
        setTimeout(() => navigate("/login"), 1500);
    };

    const handleChangeAba = (event, novaAba) => {
        setAbaAtual(novaAba);
    };

    const columns = [
        { field: "id", headerName: "ID", width: 90 },
        { field: "nome", headerName: "Nome", width: 200 },
        { field: "numero_registro", headerName: "Registro", width: 150 },
        { field: "fabricante", headerName: "Fabricante", width: 200 },
        { field: "tipo", headerName: "Tipo", width: 150 },
    ];

    const exportToCSV = () => {
        const csvContent = [
            ["ID", "Nome", "Registro", "Fabricante", "Tipo"],
            ...mercadorias.map(m => [m.id, m.nome, m.numero_registro, m.fabricante, m.tipo])
        ].map(row => row.join(",")).join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        saveAs(blob, "mercadorias.csv");
        toast.success("Arquivo CSV gerado!");
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(mercadorias);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Mercadorias");

        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

        saveAs(blob, "mercadorias.xlsx");
        toast.success("Arquivo Excel gerado!");
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.text("Lista de Mercadorias", 14, 10);

        const tableData = mercadorias.map(m => [m.id, m.nome, m.numero_registro, m.fabricante, m.tipo]);
        doc.autoTable({
            head: [["ID", "Nome", "Registro", "Fabricante", "Tipo"]],
            body: tableData
        });

        doc.save("mercadorias.pdf");
        toast.success("Arquivo PDF gerado!");
    };

    return (
        <Container>
            <ToastContainer />
            <Box display="flex" justifyContent="space-between" alignItems="center" mt={3} mb={3}>
                <Typography variant="h4">Dashboard</Typography>
                <Button variant="contained" color="secondary" onClick={handleLogout}>Logout</Button>
            </Box>

            <Tabs value={abaAtual} onChange={handleChangeAba} centered>
                <Tab label="Cadastro de Mercadorias" />
                <Tab label="Registro de Entradas" />
                <Tab label="Registro de Saídas" />
                <Tab label="Movimentação e Relatórios" />
                <Tab label="Mercadorias" />
            </Tabs>

            <Grid container spacing={3} mt={2}>
                {abaAtual === 0 && (
                    <Grid item xs={12}>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6">Cadastrar Nova Mercadoria</Typography>
                            <MercadoriaForm />
                        </Paper>
                    </Grid>
                )}

                {abaAtual === 1 && (
                    <Grid item xs={12}>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6">Registrar Entrada de Mercadorias</Typography>
                            <EntradaForm />
                        </Paper>
                    </Grid>
                )}

                {abaAtual === 2 && (
                    <Grid item xs={12}>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6">Registrar Saída de Mercadorias</Typography>
                            <SaidaForm />
                        </Paper>
                    </Grid>
                )}

                {abaAtual === 3 && (
                    <>
                        <Grid item xs={12} md={6}>
                            <Paper sx={{ p: 3 }}>
                                <Typography variant="h6">Movimentação de Mercadorias</Typography>
                                <GraficoMovimentacao />
                            </Paper>
                        </Grid>

                        <Grid item xs={12}>
                            <Paper sx={{ p: 3 }}>
                                <Typography variant="h6" gutterBottom>Lista de Mercadorias</Typography>
                                <DataGrid rows={mercadorias} columns={columns} pageSize={5} autoHeight />
                            </Paper>
                        </Grid>
                    </>
                )}

                {abaAtual === 4 && (
                    <>
                        <Grid item xs={12}>
                            <Grid container spacing={2} mb={2}>
                                <Grid item>
                                    <Button variant="contained" color="primary" onClick={exportToCSV}>Exportar CSV</Button>
                                </Grid>
                                <Grid item>
                                    <Button variant="contained" color="success" onClick={exportToExcel}>Exportar Excel</Button>
                                </Grid>
                                <Grid item>
                                    <Button variant="contained" color="error" onClick={exportToPDF}>Exportar PDF</Button>
                                </Grid>
                            </Grid>

                            <Paper sx={{ p: 3 }}>
                                <Typography variant="h6" gutterBottom>Mercadorias Cadastradas</Typography>
                                <DataGrid rows={mercadorias} columns={columns} pageSize={5} autoHeight />
                            </Paper>
                        </Grid>
                    </>
                )}
            </Grid>
        </Container>
    );
};

export default Dashboard;
