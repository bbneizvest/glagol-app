import express from "express";

const app = express();
const port = 80;

app.get("/page", (rq, rs) => {
  rs.send(
    "Yo 148, 3-to-the-3-to-the-6-to-the-9. Representin' the ABQ. What up, biatch? Leave it at the tone!"
  );
});

app.listen(port, () => {
  console.log(`Starting server at http://localhost:${port}`);
});
