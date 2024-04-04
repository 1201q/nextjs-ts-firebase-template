import { verifyIdToken } from "next-firebase-auth";
import initAuth from "@/utils/firebase/initAuth";
import { NextApiRequest, NextApiResponse } from "next";

initAuth();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!(req.headers && req.headers.authorization)) {
    return res
      .status(400)
      .json({ error: "Missing Authorization header value" });
  }
  const token = req.headers.authorization;
  let user = null;

  if (token !== "unauthenticated") {
    try {
      user = await verifyIdToken(token);
    } catch (e) {
      console.error(e);
      return res.status(403).json({ error: "Not authorized" });
    }
  }

  return res.status(200).json({ user });
};

export default handler;
