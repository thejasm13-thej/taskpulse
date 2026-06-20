const Batch = require("../models/Batch");

async function getBatches(req, res) {
  try {
    const batches = await Batch.findAll({
      order: [["name", "ASC"]],
    });
    res.json({ batches });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getBatches };
