import express from "express";
import { createShareLink } from "../controllers/shareLink.controller";

const router = express.Router();

router.post("/create-link", createShareLink);
router.get("/:token", getFile);

export default router;
