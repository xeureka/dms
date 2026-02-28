import express from "express";
import {
  generateSharingToken,
  verifySharableToken,
  verifyToken,
  type ShareLinkPayload,
} from "../utils";

export const createShareLink = (
  req: express.Request,
  res: express.Response,
) => {
  const token = req.headers["authorization"]?.slice(7);

  if (!token || token === "") {
    return res.status(500).json({ message: "cannot find any token" });
  }

  const payload = verifyToken(token as string);

  if (!payload) {
    return res.status(500).json({ message: "Token is expires or invalid" });
  }

  const userEmail = payload.email;

  const { AccessRole, FileServerPath, FileId } = req.body;

  const share_payload: ShareLinkPayload = {
    Email: userEmail,
    AccessRole,
    FileServerPath,
    FileId,
  };

  const shareToken = generateSharingToken(share_payload);

  const url = `http://localhost:3000/share?shareToken=${shareToken}`;

  res
    .status(201)
    .json({ message: "Link created successfully", shareLink: url });
};

export const getFile = (req: express.Request, res: express.Response) => {
  const { shareToken } = req.params;

  const decoded = verifySharableToken(shareToken as string);
};

// 1. make the generated link to give the file to the user from the signed token path
// 2. make the accessRole protection for view and edit (probably hashing like git do and compare it)
// 3. work on the RBAC for user and admin
// 4. fix the file traversal and protecting all routes for all priveleges

// Break down all the work flow and identify where u are
// design a step by step todo to work on the above n:write
