import express from "express";
import vmRoutes from "./routes/vmRoutes";
import cors from "cors";
import dotenv from 'dotenv/config'

const config = dotenv;
const app = express();
app.use(cors())



app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3333');
  next();
});


app.use("/api", vmRoutes);
app.use(express.static(__dirname + '/public'));
const PORT = Number(process.env.PORT || 3000); 
const HOST = process.env.HOST || 'localhost';

app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});