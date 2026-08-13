const { Op } = require("sequelize");
const Assignment = require("../models/Assignment");
const Reminder = require("../models/Reminder");
const Batch = require("../models/Batch");
const User = require("../models/User");
const { sendNewAssignmentNotification } = require("../services/emailService");

// ─── 1. POST ASSIGNMENT ───────────────────────────────────────────
async function postAssignment(req, res) {
  try {
    const { title, subject, batch_id, due_date, description } = req.body;
    const faculty_id = req.user.id;

    const file_name = req.file ? req.file.filename : null;
    const file_path = req.file ? req.file.path : null;
    const file_original = req.file ? req.file.originalname : null;

    const assignment = await Assignment.create({
      title,
      subject,
      batch_id,
      due_date,
      description,
      faculty_id,
      file_name,
      file_path,
      file_original,
    });

    const due = new Date(due_date);

    await Reminder.create({
      assignment_id: assignment.id,
      type: "48_hour",
      scheduled_at: new Date(due.getTime() - 48 * 60 * 60 * 1000),
      sent: false,
    });

    const morning = new Date(due);
    morning.setHours(8, 0, 0, 0);
    await Reminder.create({
      assignment_id: assignment.id,
      type: "morning",
      scheduled_at: morning,
      sent: false,
    });

    sendNewAssignmentNotification(assignment).catch((err) =>
      console.error("Email notification failed:", err.message),
    );

    res.status(201).json({ message: "Assignment posted", assignment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ─── 2. LIST UPCOMING DEADLINES (student) ────────────────────────
async function listUpcomingDeadlines(req, res) {
  try {
    const now = new Date();

    const assignments = await Assignment.findAll({
      where: {
        batch_id: req.user.batch_id,
        due_date: { [Op.gte]: now },
      },
      include: [
        {
          model: Batch,
          as: "batch",
          attributes: ["name", "department", "year"],
        },
      ],
      order: [["due_date", "ASC"]],
    });

    res.json({ assignments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ─── 3. LIST ALL ASSIGNMENTS (faculty dashboard) ──────────────────
async function listAllAssignments(req, res) {
  try {
    const assignments = await Assignment.findAll({
      include: [
        {
          model: Batch,
          as: "batch",
          attributes: ["name", "department", "year"],
        },
      ],
      order: [["due_date", "ASC"]],
    });
    res.json({ assignments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ─── 4. DELETE ASSIGNMENT (faculty only) ─────────────────────────
async function deleteAssignment(req, res) {
  try {
    const assignment = await Assignment.findByPk(req.params.id);

    if (!assignment) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    // Removed ownership check for now — any faculty can delete
    await assignment.destroy();
    res.json({ message: "Assignment deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  postAssignment,
  listUpcomingDeadlines,
  listAllAssignments,
  deleteAssignment,
};
