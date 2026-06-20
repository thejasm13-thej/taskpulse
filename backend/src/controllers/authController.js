const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
require("dotenv").config();

// Temporary in-memory store for reset tokens
const resetTokens = {};

// ─── REGISTER ─────────────────────────────────────────────────────
async function register(req, res) {
  try {
    const { name, email, password, role, batch_id } = req.body;
    const hash = await bcrypt.hash(password, 10);
    await User.create({
      name,
      email,
      password_hash: hash,
      role,
      batch_id: role === "student" ? batch_id : null,
    });
    res.status(201).json({ message: "Registered successfully" });
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ error: "Email already exists" });
    }
    res.status(500).json({ error: err.message });
  }
}

// ─── LOGIN ────────────────────────────────────────────────────────
async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign(
      { id: user.id, role: user.role, batch_id: user.batch_id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        batch_id: user.batch_id,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ─── FORGOT PASSWORD ──────────────────────────────────────────────
async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    // Always return success even if email not found (security best practice)
    if (!user) {
      return res.json({
        message: "If that email exists, a reset link has been sent.",
      });
    }

    // Generate a secure random token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = Date.now() + 60 * 60 * 1000; // expires in 1 hour

    // Store token in memory
    resetTokens[token] = { userId: user.id, expiresAt };

    // Build reset link
    const transporter = require("../config/email");
    const resetLink = `http://localhost:5173/reset-password?token=${token}`;

    await transporter.sendMail({
      from: `"TaskPulse" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "⚡ TaskPulse — Password Reset Request",
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
          <div style="background: #2563eb; padding: 20px;
            border-radius: 8px 8px 0 0;">
            <h2 style="color: white; margin: 0;">⚡ TaskPulse</h2>
            <p style="color: #bfdbfe; margin: 4px 0 0;">Password Reset</p>
          </div>
          <div style="background: #f8fafc; padding: 24px;
            border: 1px solid #e2e8f0;">
            <p style="color: #1e293b;">
              Hi ${user.name},
            </p>
            <p style="color: #475569;">
              You requested a password reset for your TaskPulse account.
              Click the button below to set a new password:
            </p>
            <div style="text-align: center; margin: 24px 0;">
              <a href="${resetLink}" style="
                display: inline-block;
                background: #2563eb;
                color: white;
                padding: 12px 32px;
                border-radius: 8px;
                text-decoration: none;
                font-weight: 600;
                font-size: 15px;">
                Reset My Password
              </a>
            </div>
            <p style="color: #64748b; font-size: 13px;">
              This link expires in <strong>1 hour</strong>.
              If you did not request this, you can safely ignore this email.
            </p>
          </div>
          <div style="background: #e2e8f0; padding: 12px 24px;
            border-radius: 0 0 8px 8px; text-align: center;">
            <p style="margin: 0; font-size: 12px; color: #64748b;">
              This is an automated notification from TaskPulse.
            </p>
          </div>
        </div>
      `,
    });

    res.json({ message: "If that email exists, a reset link has been sent." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ─── RESET PASSWORD ───────────────────────────────────────────────
async function resetPassword(req, res) {
  try {
    const { token, password } = req.body;
    const record = resetTokens[token];

    if (!record || Date.now() > record.expiresAt) {
      return res.status(400).json({
        error: "Reset link is invalid or expired. Please request a new one.",
      });
    }

    const hash = await bcrypt.hash(password, 10);
    await User.update(
      { password_hash: hash },
      { where: { id: record.userId } },
    );

    // Remove used token so it cannot be reused
    delete resetTokens[token];

    res.json({ message: "Password reset successful. You can now login." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { register, login, forgotPassword, resetPassword };
