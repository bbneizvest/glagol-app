import pool from "../index";
import { Page, PageData } from "@glagol-app/types";
import { QueryResult } from "pg";

export interface Row {
  oid: string;
  created_on: Date;
  updated_on: Date;
  data: PageData;
}

function isOidValidUuid(oid: string): boolean {
  const pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/;
  if (!oid.match(pattern)) {
    return false;
  }
  return true;
}

export async function queryPage(oid: string): Promise<Page> {
  return new Promise<Page>((resolve, reject) => {
    // Validating incoming parameter
    if (oid == "") {
      reject(new Error(`${QUERY_FAILED}. ${EMPTY_OID}`));
      return;
    }
    if (!isOidValidUuid(oid)) {
      reject(new Error(`${QUERY_FAILED}. ${INVALID_UUID(oid)}`));
      return;
    }

    pool
      .query(`SELECT * FROM objects.pages WHERE oid='${oid}'`)
      .then((rs: QueryResult<Row>) => {
        // No results
        if (rs.rowCount == 0) {
          reject(new Error(`${QUERY_FAILED}. ${NO_RESULTS(oid)}`));
          return;
        }

        // Forming Page object
        const page: Page = {
          meta: {
            oid: rs.rows[0].oid,
            createdOn: rs.rows[0].created_on,
            updatedOn: rs.rows[0].updated_on,
          },
          data: rs.rows[0].data,
        };

        resolve(page);
      })
      .catch((e: Error) =>
        reject(
          new Error(
            `${QUERY_FAILED}. Exception occured while accessing database.\n${e}`
          )
        )
      );
  });
}

const QUERY_FAILED = "Querying Page failed";
const NO_RESULTS = (oid: string) =>
  `No results found for Page with id='${oid}'`;
const EMPTY_OID = "Expected valid UUID value, got empty value";
const INVALID_UUID = (oid: string) =>
  `Provided OID is not valid - expected valid UUID value, got '${oid}'`;
