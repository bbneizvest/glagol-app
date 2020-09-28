import express from "express";
import pageRoutes from "./page.routes";

const router = express.Router();

router.use(express.json());
// Page
router.use("/page", pageRoutes);

export default router;
