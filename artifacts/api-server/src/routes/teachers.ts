import { Router, type IRouter, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { db, authUserTable, teachersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { authenticateToken, AuthRequest } from "../middlewares/auth.js";

const router: IRouter = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const {
      email,
      password,
      first_name,
      last_name,
      phone,
      university_name,
      gender,
      year_joined,
      subject,
      bio,
    } = req.body;

    if (!email || !password || !first_name || !last_name || !university_name || !gender || !year_joined || !subject) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ error: "Password must be at least 6 characters" });
      return;
    }

    const existing = await db
      .select()
      .from(authUserTable)
      .where(eq(authUserTable.email, email.toLowerCase()))
      .limit(1);

    if (existing.length > 0) {
      res.status(409).json({ error: "Email already registered" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [user] = await db
      .insert(authUserTable)
      .values({
        email: email.toLowerCase(),
        password: hashedPassword,
        first_name,
        last_name,
        phone: phone || null,
        is_active: true,
      })
      .returning();

    const [teacher] = await db
      .insert(teachersTable)
      .values({
        user_id: user.id,
        university_name,
        gender,
        year_joined: Number(year_joined),
        subject,
        bio: bio || null,
      })
      .returning();

    res.status(201).json({
      id: teacher.id,
      user_id: teacher.user_id,
      university_name: teacher.university_name,
      gender: teacher.gender,
      year_joined: teacher.year_joined,
      subject: teacher.subject,
      bio: teacher.bio,
      created_at: teacher.created_at,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        is_active: user.is_active,
        created_at: user.created_at,
      },
    });
  } catch (err) {
    req.log.error({ err }, "CreateTeacher error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const results = await db
      .select({
        id: teachersTable.id,
        user_id: teachersTable.user_id,
        university_name: teachersTable.university_name,
        gender: teachersTable.gender,
        year_joined: teachersTable.year_joined,
        subject: teachersTable.subject,
        bio: teachersTable.bio,
        created_at: teachersTable.created_at,
        user_id_ref: authUserTable.id,
        user_email: authUserTable.email,
        user_first_name: authUserTable.first_name,
        user_last_name: authUserTable.last_name,
        user_phone: authUserTable.phone,
        user_is_active: authUserTable.is_active,
        user_created_at: authUserTable.created_at,
      })
      .from(teachersTable)
      .innerJoin(authUserTable, eq(teachersTable.user_id, authUserTable.id));

    const teachers = results.map((r) => ({
      id: r.id,
      user_id: r.user_id,
      university_name: r.university_name,
      gender: r.gender,
      year_joined: r.year_joined,
      subject: r.subject,
      bio: r.bio,
      created_at: r.created_at,
      user: {
        id: r.user_id_ref,
        email: r.user_email,
        first_name: r.user_first_name,
        last_name: r.user_last_name,
        phone: r.user_phone,
        is_active: r.user_is_active,
        created_at: r.user_created_at,
      },
    }));

    res.json(teachers);
  } catch (err) {
    req.log.error({ err }, "ListTeachers error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
