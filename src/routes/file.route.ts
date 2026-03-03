import express, { type Request, type Response } from "express";
import { upload } from "../config/multerConfig";
import {
  fileView,
  multipleUpload,
  singleUpload,
} from "../controllers/file.controller";

const router = express.Router();

router.post("/single-upload", upload.single("document"), singleUpload);
router.post("/multiple-upload", upload.array("files", 5), multipleUpload);
router.get("/view-file/:id", fileView);

export default router;
