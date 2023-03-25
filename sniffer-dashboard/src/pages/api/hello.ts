// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  await fetch("http://localhost:5012/tartigraid")
    .then((res) => res.json())
    .then((data) => res.json(data));
}
