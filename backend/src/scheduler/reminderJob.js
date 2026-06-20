const cron = require("node-cron");
const { Op } = require("sequelize");
const Reminder = require("../models/Reminder");
const Assignment = require("../models/Assignment");
const { sendReminder } = require("../services/emailService");

cron.schedule("0 * * * *", async () => {
  console.log(`[${new Date().toISOString()}] Checking reminders...`);

  const pending = await Reminder.findAll({
    where: { sent: false, scheduled_at: { [Op.lte]: new Date() } },
    include: [{ model: Assignment }],
  });

  console.log(`Found ${pending.length} pending reminders`);

  for (const reminder of pending) {
    try {
      await sendReminder(reminder);
      await reminder.update({ sent: true, sent_at: new Date() });
      console.log(`✅ Reminder sent for "${reminder.Assignment.title}"`);
    } catch (err) {
      console.error(`❌ Failed reminder ${reminder.id}:`, err.message);
    }
  }
});

console.log("✅ Reminder scheduler started");
