import express from "express";
import { handleGetByOid, handlePost } from "../../controllers/page.controller";
const router = express.Router();

const routes = router.get("/", handleGetByOid).post("/", handlePost);

export default routes;
