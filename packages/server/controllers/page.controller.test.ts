import { Request, Response } from "express";
import { Page, PageData } from "@glagol-app/types";
import errorTypes from "@glagol-app/common/error.types";
import { handleGetByOid, handlePost } from "./page.controller";
import PageModel from "../models/page/page.model";

const OID = "1ec6cf42-fa57-44f0-8bfc-feddf7cc19c4";
const OID_INVALID = "invalidOid";
const MESSAGE_INVALID_OID =
  "OID was not provided or it is not a valid UUID value";
const MESSAGE_INVALID_JSON = "Provided JSON message is invalid";
const date = new Date(2020, 1, 1);
const PAGE_DATA_SUCCESS: PageData = {
  header: "header",
  body: "body",
};

let rs = ({} as unknown) as Response;
let spyOnQueryPage: jest.SpyInstance;
let spyOnInsertPage: jest.SpyInstance;
beforeAll(() => {
  rs = mockRs();

  // Mock accessing database
  spyOnQueryPage = jest.spyOn(PageModel, "queryPage");
  spyOnInsertPage = jest.spyOn(PageModel, "insertPage");
});
afterEach(() => {
  jest.clearAllMocks();
});

describe("handler-page-get", () => {
  test("success - page found", async () => {
    const rq = mockRq({ oid: OID }, "");
    const mockJsonResponse: Page = {
      meta: {
        oid: OID,
        createdOn: date,
        updatedOn: date,
      },
      data: {
        header: "header",
        body: "body",
      },
    };
    spyOnQueryPage.mockResolvedValueOnce(mockJsonResponse);

    await handleGetByOid(rq, rs);

    expect(rs.json).toBeCalledTimes(1);
    expect(rs.json).toBeCalledWith(mockJsonResponse);
    expect(rs.status).toBeCalledWith(200);
  });

  test("success - page not found", async () => {
    const rq = mockRq({ oid: OID }, "");
    spyOnQueryPage.mockRejectedValueOnce(
      new errorTypes.DbQueryNoResultsError("No Page found, dumbass")
    );

    await handleGetByOid(rq, rs);

    expect(rs.json).toBeCalledTimes(1);
    expect(rs.json).toBeCalledWith({});
    expect(rs.status).toBeCalledWith(200);
  });

  test("oid parameter is empty", async () => {
    const rq = mockRq({ oid: "" }, "");

    await handleGetByOid(rq, rs);

    expect(rs.send).toBeCalledTimes(1);
    expect(rs.send).toBeCalledWith(MESSAGE_INVALID_OID);
    expect(rs.status).toBeCalledWith(400);
  });

  test("invalid oid", async () => {
    const rq = mockRq({ oid: OID_INVALID }, "");

    await handleGetByOid(rq, rs);

    expect(rs.send).toBeCalledTimes(1);
    expect(rs.send).toBeCalledWith(MESSAGE_INVALID_OID);
    expect(rs.status).toBeCalledWith(400);
  });

  test("internal server error", async () => {
    const rq = mockRq({ oid: OID }, "");
    spyOnQueryPage.mockRejectedValueOnce(
      new errorTypes.DbInternalError("Boom")
    );

    await handleGetByOid(rq, rs);

    expect(rs.send).toBeCalledTimes(1);
    expect(rs.send).toBeCalledWith("Internal server error");
    expect(rs.status).toBeCalledWith(500);
  });
});

describe("handle-page-post", () => {
  test("success", async () => {
    const rq = mockRq({}, JSON.stringify(PAGE_DATA_SUCCESS));
    const mockJsonResponse: Page = {
      meta: {
        oid: OID,
        createdOn: date,
        updatedOn: date,
      },
      data: {
        header: "header",
        body: "body",
      },
    };
    spyOnInsertPage.mockResolvedValueOnce(mockJsonResponse);

    await handlePost(rq, rs);

    expect(rs.json).toBeCalledTimes(1);
    expect(rs.json).toBeCalledWith(mockJsonResponse);
    expect(rs.status).toBeCalledWith(200);
  });

  test("invalid JSON", async () => {
    const rq = mockRq({}, JSON.stringify({ peepee: "poopoo" }));

    await handlePost(rq, rs);

    expect(rs.send).toBeCalledTimes(1);
    expect(rs.send).toBeCalledWith(MESSAGE_INVALID_JSON);
    expect(rs.status).toBeCalledWith(400);
  });

  test("invalid JSON - additional fields", async () => {
    const rq = mockRq(
      {},
      JSON.stringify({ ...PAGE_DATA_SUCCESS, bad: "field" })
    );

    await handlePost(rq, rs);

    expect(rs.send).toBeCalledTimes(1);
    expect(rs.send).toBeCalledWith(MESSAGE_INVALID_JSON);
    expect(rs.status).toBeCalledWith(400);
  });

  test("internal server error", async () => {
    const rq = mockRq({}, JSON.stringify(PAGE_DATA_SUCCESS));
    spyOnInsertPage.mockRejectedValueOnce(
      new errorTypes.DbInternalError("Boom")
    );

    await handlePost(rq, rs);

    expect(rs.send).toBeCalledTimes(1);
    expect(rs.send).toBeCalledWith("Internal server error");
    expect(rs.status).toBeCalledWith(500);
  });
});

// Mocking Rq, Rs objects //

const mockRq = (query: object, body: string) => {
  const rq = {
    query: {},
    body: "",
  };

  if (Object.entries(query).length > 0) rq.query = query;
  if (body) rq.body = body;

  return (rq as unknown) as Request;
};

const mockRs = () => {
  const rs = ({} as unknown) as Response;

  rs.status = jest.fn().mockReturnValue(rs);
  rs.send = jest.fn().mockReturnValue(rs);
  rs.json = jest.fn().mockReturnValue(rs);

  return rs;
};
