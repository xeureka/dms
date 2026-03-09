import express from "express";
import cors from "cors";
import { connectDB } from "./src/config";
import userRoute from "./src/routes/user.route.ts";
import fileRoute from "./src/routes/file.route.ts";

const app = express();

app.use(cors());
app.use(express.json());

// dev defined routes
app.use("/api/auth", userRoute);
app.use("/api/file", fileRoute);

// test route
app.get("/test", (req: express.Request, res: express.Response) => {
  res.json("test route is working ");
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, async () => {
  await connectDB();
  console.log(`backend server running on port ${PORT}`);
});
