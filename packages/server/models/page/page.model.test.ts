import pool from "../index";
import { QueryResult } from "pg";
import PageModel, { Row } from "./page.model";
import { Page } from "@glagol-app/types";
import { errorTypes } from "@glagol-app/common";

let spyQuery: jest.SpyInstance;

beforeAll(() => {
  spyQuery = jest.spyOn(pool, "query");
});
afterEach(() => {
  jest.clearAllMocks();
});

describe("query-page-row", () => {
  test("success", async () => {
    spyQuery.mockResolvedValueOnce(mockQueryResult(MockQueryScenario.success));

    const outputPage: Page = {
      meta: {
        oid: OID,
        createdOn: DATE,
        updatedOn: DATE,
      },
      data: {
        header: HEADER,
        body: BODY,
      },
    };

    const rs = await PageModel.queryPage(OID);
    expect(rs).toStrictEqual(outputPage);
    expect(spyQuery).toHaveBeenCalledTimes(1);
  });

  test("row not found", async () => {
    spyQuery.mockResolvedValueOnce(mockQueryResult(MockQueryScenario.notFound));

    try {
      await PageModel.queryPage(OID);
    } catch (error) {
      expect(error).toBeInstanceOf(errorTypes.DbQueryNoResultsError);
      expect(error.message).toBe(
        `No results returned from a query. Details: No results found for Page with oid='${OID}'`
      );
    }

    expect(spyQuery).toHaveBeenCalledTimes(1);
  });

  test("empty OID", async () => {
    try {
      await PageModel.queryPage("");
    } catch (error) {
      expect(error).toBeInstanceOf(errorTypes.InvalidParameterError);
      expect(error.message).toBe(
        "Invalid parameters were provided. Details: Expected valid UUID value, got empty value"
      );
    }

    expect(spyQuery).toHaveBeenCalledTimes(0);
  });

  test("invalid UUID value", async () => {
    const INVALID_OID = "123456789";
    try {
      await PageModel.queryPage(INVALID_OID);
    } catch (error) {
      expect(error).toBeInstanceOf(errorTypes.InvalidParameterError);
      expect(error.message).toBe(
        `Invalid parameters were provided. Details: Provided OID is not valid - expected valid UUID value, got '${INVALID_OID}'`
      );
    }

    expect(spyQuery).toHaveBeenCalledTimes(0);
  });

  test("internal tech error", async () => {
    const ERR_MSG = "Internal server error";
    spyQuery.mockRejectedValueOnce(new Error(ERR_MSG));

    try {
      await PageModel.queryPage(OID);
    } catch (error) {
      expect(error).toBeInstanceOf(errorTypes.DbInternalError);
      expect(error.message).toBe(
        `Querying DB records failed. Details: ${ERR_MSG}`
      );
    }

    expect(spyQuery).toHaveBeenCalledTimes(1);
  });
});

enum MockQueryScenario {
  success,
  notFound,
}

const OID = "1ec6cf42-fa57-44f0-8bfc-feddf7cc19c4";
const DATE = new Date(2014, 1, 11);
const HEADER = "Maya Deren";
const BODY = "Influential figure in American avant-garde cinema";
function mockQueryResult(scenario: MockQueryScenario): QueryResult<Row> {
  switch (scenario) {
    case MockQueryScenario.success:
      return {
        command: "SELECT",
        rowCount: 1,
        oid: (null as unknown) as number,
        fields: [],
        rows: [
          {
            oid: OID,
            created_on: DATE,
            updated_on: DATE,
            data: {
              header: HEADER,
              body: BODY,
            },
          },
        ],
      };
    case MockQueryScenario.notFound:
      return {
        command: "SELECT",
        rowCount: 0,
        oid: (null as unknown) as number,
        fields: [],
        rows: [],
      };
  }
}
