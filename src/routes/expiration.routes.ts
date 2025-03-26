import e, { Router } from "express";
import { expireOff } from "../controllers/expiration.controller";

const expirationRoutes = Router();

expirationRoutes.get('/expireOff.aspx', expireOff);

export default expirationRoutes;
