import jwt, { type Jwt } from "jsonwebtoken";

export interface AuthTokenPayload extends jwt.JwtPayload {
  Email: string;
  Username: string;
  Id: string;
  Role: string;
}

export function genAccessToken(
  email: string,
  username: string,
  id: string,
): string {
  const accessToken = jwt.sign(
    { Email: email, Username: username, Id: id, Role: "user" },
    Bun.env.ACCESS_TOKEN_SECRET!,
    {
      expiresIn: "3000min",
    },
  );
  return accessToken;
}

export function verifyToken(token: string): AuthTokenPayload {
  const verified = jwt.verify(token, Bun.env.ACCESS_TOKEN_SECRET!);
  return verified as AuthTokenPayload;
}
