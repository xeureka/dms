import { type Request, type Response } from "express";
import { upload } from "../config/multerConfig";
import { verifyToken } from "../utils";
import { pool } from "../config";
import fs from "fs";

export const singleUpload = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const token = req.headers["authorization"]?.slice(7);

    if (!token || token === "") {
      return res.status(500).json({ message: "cannot find any token" });
    }

    const payload = verifyToken(token as string);

    if (!payload) {
      return res.status(500).json({ message: "Token is expires or invalid" });
    }

    const fileName = req.file.filename; // stored name
    const filePath = req.file.path;
    const originalName = req.file.originalname;
    const ownerId = payload.Id;
    const fileSize = req.file.size;

    const uploadQuery = `
      INSERT INTO files 
      (original_name, stored_name, server_path, file_size, owner_id) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING *
    `;

    const uploadValues = [originalName, fileName, filePath, fileSize, ownerId];

    const result = await pool.query(uploadQuery, uploadValues);

    res.status(200).json({
      message: "File uploaded successfully",
      fileDetails: {
        fileName: result.rows[0].stored_name,
        originalName: result.rows[0].original_name,
        filePath: result.rows[0].server_path,
        size: `${(result.rows[0].file_size / 1024).toFixed(2)} KB`,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const multipleUpload = async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No File Uploaded" });
    }

    const savedFiles = [];

    for (const file of files) {
      const result = await pool.query(
        `
        INSERT INTO files (original_name, storage_name, mimetype, size)
        VALUES ($1, $2, $3, $4)
        RETURNING *
        `,
        [file.originalname, file.filename, file.mimetype, file.size],
      );

      savedFiles.push(result.rows[0]);
    }

    return res.status(200).json(savedFiles);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Upload failed" });
  }
};

// file upload route

export const fileView = async (req: Request, res: Response) => {
  try {
    const fileId = req.params.id;

    const token = req.headers["authorization"]?.slice(7);

    if (!token || token === "") {
      return res.status(500).json({ message: "cannot find any token" });
    }

    const payload = verifyToken(token as string);

    if (!payload) {
      return res.status(500).json({ message: "Token is expired or invalid" });
    }

    const email = payload.Email;
    const requestId = payload.Id;

    const ownerCheckingQuery = "SELECT * FROM users WHERE email=$1";
    const ownerEmailValue = [email];

    const ownershipResult = await pool.query(
      ownerCheckingQuery,
      ownerEmailValue,
    );

    const owner_id = ownershipResult.rows[0].owner_id;

    if (owner_id === requestId) {
      // stream the file
      const { storage_path, original_name } = ownershipResult.rows[0];

      if (!fs.existsSync(storage_path)) {
        return res.status(404).json({ message: "File missing on server" });
      }

      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${original_name}"`,
      );

      res.setHeader("Content-Type", "text");

      const stream = fs.createReadStream(storage_path);
      stream.pipe(res);
    }

    // TODO: CHECK IF THE USER HAVE A FILE ACCCESS HERE

    return res.status(403).json({ message: "file access denined" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Finding file failed" });
  }
};
