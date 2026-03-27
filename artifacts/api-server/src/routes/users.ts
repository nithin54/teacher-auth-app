import { Router, type IRouter, Response } from "express";
import { db, authUserTable } from "@workspace/db";
import { authenticateToken, AuthRequest } from "../middlewares/auth.js";

const router: IRouter = Router();

router.get("/", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const users = await db.select().from(authUserTable);
    res.json(
      users.map((u) => ({
        id: u.id,
        email: u.email,
        first_name: u.first_name,
        last_name: u.last_name,
        phone: u.phone,
        is_active: u.is_active,
        created_at: u.created_at,
      }))
    );
  } catch (err) {
    req.log.error({ err }, "ListUsers error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
