import express, { Router, json } from "express";
import ViteExpress from "vite-express";
import { initServer } from "./api";

const app = express();
app.use(json());
const router = Router();
initServer(router);

app.use("/api/", router);

ViteExpress.listen(app, 3000, () => console.log("Server is listening..."));
