import { isOidValidUuid, errorTypes } from "@glagol-app/common";
import { Request, Response } from "express";
import PageModel from "../models/page/page.model";

export async function handleGetByOid(rq: Request, rs: Response) {
  const oid: string = rq.query.oid as string;

  if (!isOidValidUuid(oid)) {
    rs.status(400).send("OID was not provided or it is not a valid UUID value");
    return;
  }

  try {
    const result = await PageModel.queryPage(oid);
    rs.status(200).json(result);
  } catch (error) {
    if (error instanceof errorTypes.DbQueryNoResultsError) {
      rs.status(200).json({});
    } else {
      rs.status(500).send("Internal server error");
    }
  }
}

// TODO Get messages from .yaml file
// async function getApiDoc() {}
