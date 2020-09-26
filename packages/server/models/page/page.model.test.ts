import pool from "../index";
import { QueryResult } from "pg";
import { Row, queryPage } from "./page.model";
import { Page } from "@glagol-app/types";

let spyQuery: jest.SpyInstance;

beforeAll(() => {
  spyQuery = jest.spyOn(pool, "query");
});
afterEach(() => {
  jest.clearAllMocks();
});

describe("page-query-row", () => {
  const validOid = "1ec6cf42-fa57-44f0-8bfc-feddf7cc19c4";

  test("success", async () => {
    spyQuery.mockResolvedValueOnce(mockQueryResult(MockQueryScenario.success));

    const outputPage: Page = {
      meta: {
        oid: validOid,
        createdOn: new Date(2014, 1, 11),
        updatedOn: new Date(2014, 1, 11),
      },
      data: {
        header: "Maya Deren",
        body:
          "Maya Deren is one of the most influential figures in American avant-garde cinema",
      },
    };

    const rs = await queryPage(validOid);
    expect(rs).toStrictEqual(outputPage);
    expect(spyQuery).toHaveBeenCalledTimes(1);
  });

  test("row not found", async () => {
    spyQuery.mockResolvedValueOnce(mockQueryResult(MockQueryScenario.notFound));

    await expect(queryPage(validOid)).rejects.toThrow(
      `Querying Page failed. No results found for Page with id='${validOid}'`
    );

    expect(spyQuery).toHaveBeenCalledTimes(1);
  });

  test("empty OID", async () => {
    await expect(queryPage("")).rejects.toThrow(
      `Querying Page failed. Expected valid UUID value, got empty value`
    );

    expect(spyQuery).toHaveBeenCalledTimes(0);
  });

  test("invalid UUID value", async () => {
    await expect(queryPage("123456789")).rejects.toThrow(
      `Querying Page failed. Provided OID is not valid - expected valid UUID value, got '${123456789}'`
    );

    expect(spyQuery).toHaveBeenCalledTimes(0);
  });

  test("internal tech error", async () => {
    const errMsg = "Internal server error";
    spyQuery.mockRejectedValueOnce(new Error(errMsg));

    await expect(queryPage(validOid)).rejects.toThrow(
      `Querying Page failed. Exception occured while accessing database.\nError: ${errMsg}`
    );

    expect(spyQuery).toHaveBeenCalledTimes(1);
  });
});

enum MockQueryScenario {
  success,
  notFound,
}

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
            oid: "1ec6cf42-fa57-44f0-8bfc-feddf7cc19c4",
            created_on: new Date(2014, 1, 11),
            updated_on: new Date(2014, 1, 11),
            data: {
              header: "Maya Deren",
              body:
                "Maya Deren is one of the most influential figures in American avant-garde cinema",
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
