import express, { type Request, type Response } from "express";
import { upload } from "../config/multerConfig";
import {
  multipleUpload,
  singleUpload,
} from "../controllers/fileUpload.controller";

const router = express.Router();

router.post("/single-upload", upload.single("document"), singleUpload);
router.post("/multiple-upload", upload.array("files", 5), multipleUpload);

export default router;
