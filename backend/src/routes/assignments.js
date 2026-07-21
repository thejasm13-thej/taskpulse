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

router.get("/batches", verifyToken, getBatches);

// upload.single('file') handles the file field named 'file'
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
