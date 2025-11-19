import express from "express";
import {
  getPublishers,
  addPublisher,
  deletePublisher,
} from "../Controller/Publishercontroller.js";

const router = express.Router();

router.get("/", getPublishers);
router.post("/", addPublisher);
router.delete("/:id", deletePublisher);

export default router;
