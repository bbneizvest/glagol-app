import pool from "../index";
import { QueryResult } from "pg";
import { Page, PageData } from "@glagol-app/types";
import { isOidValidUuid, errorTypes } from "@glagol-app/common";

export interface Row {
  oid: string;
  created_on: Date;
  updated_on: Date;
  data: PageData;
}

async function queryPage(oid: string): Promise<Page> {
  return new Promise<Page>((resolve, reject) => {
    // Validating incoming parameter
    if (oid == "") {
      reject(
        new errorTypes.InvalidParameterError(
          "Expected valid UUID value, got empty value"
        )
      );
      return;
    }
    if (!isOidValidUuid(oid)) {
      reject(
        new errorTypes.InvalidParameterError(
          `Provided OID is not valid - expected valid UUID value, got '${oid}'`
        )
      );
      return;
    }

    pool
      .query(`SELECT * FROM objects.pages WHERE oid='${oid}'`)
      .then((rs: QueryResult<Row>) => {
        // No results
        if (rs.rowCount == 0) {
          reject(
            new errorTypes.DbQueryNoResultsError(
              `No results found for Page with oid='${oid}'`
            )
          );
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
      .catch((e: Error) => reject(new errorTypes.DbInternalError(e.message)));
  });
}

export default {
  queryPage,
};
