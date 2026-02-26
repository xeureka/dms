import { type Request, type Response } from "express";
import { upload } from "../config/multerConfig";
import { verifyToken } from "../utils";
import { pool } from "../config";

export const singleUpload = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  // here is the playground

  const token = req.headers["authorization"]?.slice(7);

  if (!token || token === "") {
    return res.status(500).json({ message: "cannot find any token" });
  }

  const payload = verifyToken(token as string);

  if (!payload) {
    return res.status(500).json({ message: "Token is expires or invalid" });
  }

  const fileName = req.file.filename;
  const filePath = req.file.path;
  const originalName = req.file.originalname;
  const ownerId = payload.Id;

  const uploadQuery =
    "INSERT INTO files (originalName,storageName,filePath,ownerId) VALUES ($1,$2,$3,$4) RETURNING *";
  const uploadValues = [originalName, fileName, filePath, ownerId];

  const result = await pool.query(uploadQuery, uploadValues);

  res.status(200).json({
    message: "File uploaded successfully",
    fileDetails: {
      fileName: result.rows[0].originalname,
      originalName: result.rows[0].storagename,
      filePath: result.rows[0].filepath,
      size: `${(req.file.size / 1024).toFixed(2)} KB`,
    },
  });
};

export const multipleUpload = (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[];

  if (!files || files.length === 0) {
    return res.status(400).json({ message: "No File Uploaded" });
  }

  const response = files.map((file) => ({
    originalName: file.originalname,
    storageName: file.filename,
  }));

  res.status(200).json(response);
};
