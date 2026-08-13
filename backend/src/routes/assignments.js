const express = require("express");
const router = express.Router();
const {
  postAssignment,
  listUpcomingDeadlines,
  listAllAssignments,
  deleteAssignment,
} = require("../controllers/assignmentController");
const { getBatches } = require("../controllers/batchController");
const { verifyToken } = require("../middleware/auth");
const { requireRole } = require("../middleware/roleCheck");
const upload = require("../config/multer");

router.get("/batches/public", getBatches);
router.get("/batches", verifyToken, getBatches);
router.post(
  "/",
  verifyToken,
  requireRole("faculty"),
  upload.single("file"),
  postAssignment,
);
router.get(
  "/upcoming",
  verifyToken,
  requireRole("student"),
  listUpcomingDeadlines,
);
router.get("/all", verifyToken, requireRole("faculty"), listAllAssignments);
router.delete("/:id", verifyToken, requireRole("faculty"), deleteAssignment);

module.exports = router;
