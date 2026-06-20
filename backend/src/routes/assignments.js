const express = require("express");
const router = express.Router();
const {
  postAssignment,
  listUpcomingDeadlines,
  listAllAssignments,
} = require("../controllers/assignmentController");
const { getBatches } = require("../controllers/batchController");
const { verifyToken } = require("../middleware/auth");
const { requireRole } = require("../middleware/roleCheck");

router.get("/batches", verifyToken, getBatches);
router.post("/", verifyToken, requireRole("faculty"), postAssignment);
router.get(
  "/upcoming",
  verifyToken,
  requireRole("student"),
  listUpcomingDeadlines,
);
router.get("/all", verifyToken, requireRole("faculty"), listAllAssignments);

module.exports = router;
