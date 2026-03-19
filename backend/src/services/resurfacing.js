// services/resurfacing.js
const cron = require("node-cron");
const Item = require("../models/item.model");
const User = require("../models/user.model");

// ── Resurfacing Logic ─────────────────────────────────
// Har roz raat 9 baje chalega
// "2 months ago you saved this" — memory resurface karta hai
const startResurfacingJob = () => {
  // Cron syntax: "0 21 * * *" = every day at 9 PM
  cron.schedule("0 21 * * *", async () => {
    console.log("Running resurfacing job...");

    try {
      // Aaj se exactly 7 din, 30 din, 90 din pehle save kiye items
      const now = new Date();

      const intervals = [7, 30, 90]; // days

      for (const days of intervals) {
        const targetDate = new Date(now);
        targetDate.setDate(targetDate.getDate() - days);

        // Us din save kiye gaye items dhundo
        const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

        const items = await Item.find({
          createdAt: { $gte: startOfDay, $lte: endOfDay },
          isArchived: false,
        }).populate("user", "email");

        // Each item ke liye resurfacing entry banao
        for (const item of items) {
          console.log(
            `Resurface for user ${item.user.email}: "${item.title}" saved ${days} days ago`
          );
          // Future: email notification ya in-app notification bhej sakte ho
        }
      }

      console.log("Resurfacing job completed!");

    } catch (error) {
      console.error("Resurfacing job error:", error);
    }
  });

  console.log("Resurfacing cron job started!");
};

// ── Get Resurfaced Items for User ─────────────────────
// GET /api/items/resurfaced
// Returns items saved 7, 30, or 90 days ago
const getResurfacedItems = async (userId) => {
  const now = new Date();
  const intervals = [7, 30, 90];
  const resurfaced = [];

  for (const days of intervals) {
    const targetDate = new Date(now);
    targetDate.setDate(targetDate.getDate() - days);

    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const items = await Item.find({
      user: userId,
      createdAt: { $gte: startOfDay, $lte: endOfDay },
      isArchived: false,
    }).select("-embedding -content");

    // Each item ke saath "X days ago" message add karo
    items.forEach((item) => {
      resurfaced.push({
        ...item.toObject(),
        resurfaceMessage: `${days} days ago you saved this`,
        daysAgo: days,
      });
    });
  }

  return resurfaced;
};

module.exports = { startResurfacingJob, getResurfacedItems };