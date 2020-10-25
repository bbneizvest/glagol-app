import { Request, Response } from "express";
import { isValidUuid, errorTypes } from "@glagol-app/common";
import { PageData, isPageData } from "@glagol-app/types";
import PageModel from "../models/page/page.model";

export async function handleGetByOid(rq: Request, rs: Response) {
  const oid: string = rq.query.oid as string;

  if (!isValidUuid(oid)) {
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

export async function handlePost(rq: Request, rs: Response) {
  const pageData: PageData = JSON.parse(rq.body);

  if (!isPageData(pageData)) {
    rs.status(400).send("Provided JSON message is invalid");
    return;
  }

  try {
    const result = await PageModel.insertPage(pageData);
    rs.status(200).json(result);
  } catch {
    rs.status(500).send("Internal server error");
  }
}

// TODO Get messages from .yaml file
// async function getApiDoc() {}
