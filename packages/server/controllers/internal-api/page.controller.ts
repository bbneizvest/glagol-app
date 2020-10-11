import { Request, Response } from "express";

export async function handleGetByOid(rq: Request, rs: Response) {
  console.log("rq.query.oid =>", rq.query.oid);
  rs.status(200);
  rs.json(`yolo ${rq.query.oid}`);
}
