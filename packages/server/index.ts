import express from "express";
import internalApiRouter from "./routes/internal-api";

const app = express();
const port = 80;

app.use("/api/internal/v1", internalApiRouter);

app.listen(port, () => {
  console.log(`Starting server at http://localhost:${port}`);
});
