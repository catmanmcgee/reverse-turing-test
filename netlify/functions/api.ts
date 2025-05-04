import express, { Router, json } from "express";
import serverless from "serverless-http";
import { initServer } from "../../src/server/api";

const api = express();

api.use(json());
const router = Router();
initServer(router);

api.use("/api/", router);

export const handler = serverless(api);
