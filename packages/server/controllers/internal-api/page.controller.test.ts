import { Page } from "@glagol-app/types";
import { Request, Response } from "express";
import { handleGetByOid } from "./page.controller";

const oid = "c6eae460-0641-4fb1-8d38-38c724f51951";
const date = new Date(2020, 1, 1);

describe("page-handler-get-oid", () => {
  test("success", async () => {
    const rq = mockRq(oid);
    const rs = mockRs(RsMockScenario.success);
    const rsJson: Page = {
      meta: {
        oid,
        createdOn: date,
        updatedOn: date,
      },
      data: {
        header: "header",
        body: "body",
      },
    };

    await handleGetByOid(rq, rs);

    expect(rs.status).toHaveBeenCalledWith(200);
    expect(rs.json).toHaveBeenCalledTimes(1);
  });
});

enum RsMockScenario {
  success,
}

const mockRq = (oid: string) =>
  (({
    query: {
      oid,
    },
  } as unknown) as Request);

const mockRs = (scenario: RsMockScenario) => {
  const rs = ({} as unknown) as Response;

  rs.status = jest.fn().mockReturnValue(rs);
  rs.send = jest.fn().mockReturnValue(rs);
  rs.json = jest.fn().mockReturnValue(rs);

  return rs;
};
