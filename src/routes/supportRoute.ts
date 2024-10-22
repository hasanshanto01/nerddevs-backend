import { Router } from "express";
import { createTicket } from "../controllers/supportController";

const router = Router();

router.route("/create_ticket").post(createTicket);

export default router;
