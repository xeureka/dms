import type { Request, Response } from "express";
import { pool } from "../config/index.ts";
import { hashPassword, verifyPassword } from "../utils/password.ts";
import { genAccessToken } from "../utils/token.ts";

export const registerUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  const exitQuery = "SELECT email FROM users WHERE email=$1";
  const existValue = [email];

  const isEmailExists = await pool.query(exitQuery, existValue);

  if (isEmailExists.rowCount && isEmailExists.rowCount > 0) {
    return res
      .json({ message: "email already exist please try to login" })
      .status(409);
  }

  const hashedPassword = await hashPassword(password);

  const registerQuery =
    "INSERT INTO users (username,email,password_hash) VALUES ($1,$2,$3) RETURNING *";
  const registerValues = [username, email, hashedPassword];

  const registeredUser = await pool.query(registerQuery, registerValues);

  const gettingIdQuery = "SELECT id FROM users WHERE email=$1";
  const gettingIdValue = [email];
  const idQueryReturn = await pool.query(gettingIdQuery, gettingIdValue);

  const id = idQueryReturn.rows[0].id;

  const token = genAccessToken(email, username, id);

  res
    .status(201)
    .setHeader("Authorization", `Bearer ${token}`)
    .json(registeredUser.rows[0]);
};

export const loginUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  const existancequery = "SELECT email,password_hash FROM users WHERE email=$1";
  const existancevalue = [email];

  const isuserexists = await pool.query(existancequery, existancevalue);

  if (isuserexists.rowCount === 0) {
    return res

      .json({ message: "user aint exist please register first" })
      .status(409);
  }

  const db_hash = isuserexists.rows[0].password_hash;
  const isMatch = await verifyPassword(password, db_hash);

  if (!isMatch) {
    return res.status(403).json({ message: "invalid credential" });
  }
  const gettingIdQuery = "SELECT id FROM users WHERE email=$1";
  const gettingIdValue = [email];
  const idQueryReturn = await pool.query(gettingIdQuery, gettingIdValue);

  const id = idQueryReturn.rows[0].id;

  const token = genAccessToken(email, username, id);

  res
    .setHeader("Authorization", `Bearer ${token}`)
    .json({ message: "login successfull" });
};

export const logoutUser = async (req: Request, res: Response) => {
  res
    .status(200)
    .json("Logout successfull please delete the token on the frontend ");
};

// reset password
// forget password
// email verification
// 0Auth ( google and github login )
