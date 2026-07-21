const transporter = require("../config/email");
const Reminder = require("../models/Reminder");
const Assignment = require("../models/Assignment");
const User = require("../models/User");

// ─── SEND REMINDER EMAIL (48hr or morning) ────────────────────────
async function sendReminder(reminder) {
  const assignment = reminder.Assignment;

  const students = await User.findAll({
    where: { batch_id: assignment.batch_id, role: "student" },
  });

  if (students.length === 0) {
    console.log(`No students found for batch ${assignment.batch_id}`);
    return;
  }

  const isUrgent = reminder.type === "morning";
  const subject = isUrgent
    ? `🔔 Due TODAY: ${assignment.title}`
    : `⏰ 48-hour reminder: ${assignment.title} due soon`;

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #2563eb; padding: 20px; border-radius: 8px 8px 0 0;">
        <h2 style="color: white; margin: 0;">⚡ TaskPulse</h2>
        <p style="color: #bfdbfe; margin: 4px 0 0;">Assignment Reminder</p>
      </div>
      <div style="background: #f8fafc; padding: 24px; border: 1px solid #e2e8f0;">
        <h3 style="color: #1e293b; margin-top: 0;">${assignment.title}</h3>
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
          <tr>
            <td style="padding: 8px 0; color: #64748b; width: 120px;">Subject</td>
            <td style="padding: 8px 0; color: #1e293b; font-weight: 500;">
              ${assignment.subject}
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b;">Due Date</td>
            <td style="padding: 8px 0; color: #dc2626; font-weight: 500;">
              ${new Date(assignment.due_date).toLocaleString("en-IN", {
                dateStyle: "full",
                timeStyle: "short",
              })}
            </td>
          </tr>
          ${
            assignment.description
              ? `
          <tr>
            <td style="padding: 8px 0; color: #64748b; vertical-align: top;">Details</td>
            <td style="padding: 8px 0; color: #1e293b;">${assignment.description}</td>
          </tr>`
              : ""
          }
        </table>
        <div style="background: ${isUrgent ? "#fee2e2" : "#fef3c7"};
          padding: 12px 16px; border-radius: 8px; margin-top: 16px;">
          <p style="margin: 0; color: ${isUrgent ? "#dc2626" : "#d97706"};
            font-weight: 600;">
            ${
              isUrgent
                ? "⚠️ This assignment is due TODAY. Submit before the deadline!"
                : "⏰ You have 48 hours left. Plan your time wisely!"
            }
          </p>
        </div>
      </div>
      <div style="background: #e2e8f0; padding: 12px 24px;
        border-radius: 0 0 8px 8px; text-align: center;">
        <p style="margin: 0; font-size: 12px; color: #64748b;">
          This is an automated notification from TaskPulse.
          You are receiving this because you are enrolled in this batch.
        </p>
      </div>
    </div>
  `;

  for (const student of students) {
    await transporter.sendMail({
      from: `"TaskPulse" <${process.env.EMAIL_USER}>`,
      to: student.email,
      subject,
      html,
    });
    console.log(`📧 Reminder email sent to ${student.email}`);
  }
}

// ─── SEND NEW ASSIGNMENT NOTIFICATION ────────────────────────────
async function sendNewAssignmentNotification(assignment) {
  const students = await User.findAll({
    where: { batch_id: assignment.batch_id, role: "student" },
  });

  if (students.length === 0) {
    console.log(`No students found for batch ${assignment.batch_id}`);
    return;
  }

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #2563eb; padding: 20px; border-radius: 8px 8px 0 0;">
        <h2 style="color: white; margin: 0;">⚡ TaskPulse</h2>
        <p style="color: #bfdbfe; margin: 4px 0 0;">New Assignment Posted</p>
      </div>
      <div style="background: #f8fafc; padding: 24px; border: 1px solid #e2e8f0;">
        <h3 style="color: #1e293b; margin-top: 0;">${assignment.title}</h3>
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
          <tr>
            <td style="padding: 8px 0; color: #64748b; width: 120px;">Subject</td>
            <td style="padding: 8px 0; color: #1e293b; font-weight: 500;">
              ${assignment.subject}
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b;">Due Date</td>
            <td style="padding: 8px 0; color: #dc2626; font-weight: 500;">
              ${new Date(assignment.due_date).toLocaleString("en-IN", {
                dateStyle: "full",
                timeStyle: "short",
              })}
            </td>
          </tr>
         ${
           assignment.description
             ? `
<tr>
  <td style="padding: 8px 0; color: #64748b; vertical-align: top;">Details</td>
  <td style="padding: 8px 0; color: #1e293b;">${assignment.description}</td>
</tr>`
             : ""
         }
${
  assignment.file_original
    ? `
<tr>
  <td style="padding: 8px 0; color: #64748b; vertical-align: top;">Attachment</td>
  <td style="padding: 8px 0;">
    <a href="http://localhost:5000/uploads/${assignment.file_name}"
      style="
        display: inline-block;
        background: #eff6ff;
        color: #2563eb;
        padding: 6px 14px;
        border-radius: 6px;
        font-size: 13px;
        text-decoration: none;
        font-weight: 600;
        border: 1px solid #bfdbfe;">
      📎 Download: ${assignment.file_original}
    </a>
  </td>
</tr>`
    : ""
}
        </table>
        <div style="background: #dcfce7; padding: 12px 16px;
          border-radius: 8px; margin-top: 16px;">
          <p style="margin: 0; color: #16a34a; font-weight: 600;">
            ✅ You will receive automatic reminders 48 hours before
            and on the morning of the due date.
          </p>
        </div>
      </div>
      <div style="background: #e2e8f0; padding: 12px 24px;
        border-radius: 0 0 8px 8px; text-align: center;">
        <p style="margin: 0; font-size: 12px; color: #64748b;">
          This is an automated notification from TaskPulse.
          You are receiving this because you are enrolled in this batch.
        </p>
      </div>
    </div>
  `;

  for (const student of students) {
    await transporter.sendMail({
      from: `"TaskPulse" <${process.env.EMAIL_USER}>`,
      to: student.email,
      subject: `📢 New Assignment: ${assignment.title} — Due ${new Date(assignment.due_date).toDateString()}`,
      html,
    });
    console.log(`📧 New assignment notification sent to ${student.email}`);
  }
}

module.exports = { sendReminder, sendNewAssignmentNotification };
