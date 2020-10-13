import { Page } from "@glagol-app/types";
import PageModel from "../models/page/page.model";
import { Request, Response } from "express";
import { handleGetByOid } from "./page.controller";
import errorTypes from "@glagol-app/common/error.types";

const OID = "1ec6cf42-fa57-44f0-8bfc-feddf7cc19c4";
const OID_INVALID = "invalidOid";
const MESSAGE_INVALID_OID =
  "OID was not provided or it is not a valid UUID value";
const date = new Date(2020, 1, 1);

let rs = ({} as unknown) as Response;
let spyOnQueryPage: jest.SpyInstance;
beforeAll(() => {
  rs = mockRs();

  // Mock accessing database
  spyOnQueryPage = jest.spyOn(PageModel, "queryPage");
});
afterEach(() => {
  jest.clearAllMocks();
});

describe("handler-page-get", () => {
  test("success - page found", async () => {
    const rq = mockRq(OID);
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
    const rq = mockRq(OID);
    spyOnQueryPage.mockRejectedValueOnce(
      new errorTypes.DbQueryNoResultsError("No Page found, dumbass")
    );

    await handleGetByOid(rq, rs);

    expect(rs.json).toBeCalledTimes(1);
    expect(rs.json).toBeCalledWith({});
    expect(rs.status).toBeCalledWith(200);
  });

  test("oid parameter is empty", async () => {
    const rq = mockRq("");

    await handleGetByOid(rq, rs);

    expect(rs.send).toBeCalledTimes(1);
    expect(rs.send).toBeCalledWith(MESSAGE_INVALID_OID);
    expect(rs.status).toBeCalledWith(400);
  });

  test("invalid oid", async () => {
    const rq = mockRq(OID_INVALID);

    await handleGetByOid(rq, rs);

    expect(rs.send).toBeCalledTimes(1);
    expect(rs.send).toBeCalledWith(MESSAGE_INVALID_OID);
    expect(rs.status).toBeCalledWith(400);
  });

  test("internal server error", async () => {
    const rq = mockRq(OID);
    spyOnQueryPage.mockRejectedValueOnce(
      new errorTypes.DbInternalError("Boom")
    );

    await handleGetByOid(rq, rs);

    expect(rs.send).toBeCalledTimes(1);
    expect(rs.send).toBeCalledWith("Internal server error");
    expect(rs.status).toBeCalledWith(500);
  });
});

const mockRq = (oid: string) =>
  (({
    query: {
      oid,
    },
  } as unknown) as Request);

const mockRs = () => {
  const rs = ({} as unknown) as Response;

  rs.status = jest.fn().mockReturnValue(rs);
  rs.send = jest.fn().mockReturnValue(rs);
  rs.json = jest.fn().mockReturnValue(rs);

  return rs;
};
