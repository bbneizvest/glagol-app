import express from "express";
import { handleGetByOid } from "../../controllers/internal-api/page.controller";
const router = express.Router();

const routes = router.get("/", handleGetByOid);

export default routes;
