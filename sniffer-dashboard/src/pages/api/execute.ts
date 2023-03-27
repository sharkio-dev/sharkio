// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  await fetch("http://localhost:5012/tartigraid/execute", {
    method: "post",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(req.body),
  })
    .then((res) => res.json())
    .then((data) => res.json(data));
}
