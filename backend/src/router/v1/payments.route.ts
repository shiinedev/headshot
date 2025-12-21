import {Router} from "express";

const router = Router();

router.get("/webhook", (req, res) => {
  res.send("Hello World!");
});

export default router;