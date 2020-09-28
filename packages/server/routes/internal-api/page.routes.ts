import express from "express";
const router = express.Router();

const routes = router.get("/", (rq, rs) => {
  // TODO query Page row
  rs.send(`yolo ${rq.query.oid}`);
});

export default routes;
