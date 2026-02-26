import express from "express";
import { connectDB } from "./src/config";
import userRoute from "./src/routes/user.route.ts";
import fileRoute from "./src/routes/fileUpload.route.ts";
import shareLinkRoute from "./src/routes/shareLink.route.ts";

const app = express();

app.use(express.json());

// dev defined routes
app.use("/auth", userRoute);
app.use("/", fileRoute);
app.use("/", shareLinkRoute);

// test route
app.get("/test", (req: express.Request, res: express.Response) => {
  res.json("test route is working ");
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, async () => {
  await connectDB();
  console.log(`backend server running on port ${PORT}`);
});
