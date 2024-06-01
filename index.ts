import express from "express";
import vmRoutes from "./routes/vmRoutes";

import dotenv from 'dotenv/config'

const config = dotenv;
const app = express();

app.use(express.json());

app.use("/api", vmRoutes);
app.use(express.static(__dirname + '/public'));
const PORT = Number(process.env.PORT || 3000); 
const HOST = process.env.HOST || 'localhost';

app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});