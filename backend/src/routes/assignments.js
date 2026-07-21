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
const upload = require("../config/multer");

// PUBLIC route — no token needed (for registration page)
router.get("/batches/public", getBatches);

// PROTECTED routes
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

module.exports = router;
