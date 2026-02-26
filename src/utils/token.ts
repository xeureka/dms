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

export interface ShareLinkPayload extends jwt.JwtPayload {
  Email: string;
  AccessRole: string;
  FileServerPath: string;
  FileId: string;
}

export function generateSharingToken(payload: ShareLinkPayload): string {
  const shareToken = jwt.sign(payload, Bun.env.SHARE_TOKEN_SECRET!, {
    expiresIn: "50min",
  });

  return shareToken;
}

export function verifySharableToken(token: string): ShareLinkPayload {
  const payload = jwt.verify(token, Bun.env.SHARE_TOKEN_SECRET!);
  return payload as ShareLinkPayload;
}
