const express = require("express");
const { pool } = require("../db");
const requireLogin = require("../middleware/requireLogin");

const router = express.Router();

router.get("/dashboard", requireLogin, async (req, res) => {
  try {
    const [
      [summaryRows],
      [disposedRows],
      [serviceValueRows],
      [disposalBreakdownRows],
      [conditionBreakdownRows],
      [topItemsRows],
    ] = await Promise.all([

      pool.query(`
        SELECT
          COALESCE(SUM(i.quantity * i.unit_price), 0) AS totalValue,
          COUNT(*) AS activeItems,
          COALESCE(SUM(i.quantity), 0) AS totalQuantity
        FROM items i
        JOIN status st ON st.id = i.status_id
        WHERE st.id = 1
      `),

      pool.query(`
        SELECT
          COUNT(*) AS disposedCount,
          COALESCE(SUM(i.quantity * i.unit_price), 0) AS disposedValue
        FROM items i
        JOIN status st ON st.id = i.status_id
        WHERE st.id <> 1
      `),

      pool.query(`
        SELECT
          s.id,
          s.name,
          SUM(i.quantity * i.unit_price) AS value
        FROM items i
        JOIN service s ON s.id = i.service_id
        JOIN status st ON st.id = i.status_id
        WHERE st.id = 1
        GROUP BY s.id, s.name
        ORDER BY value DESC
      `),

      pool.query(`
        SELECT
          st.id,
          st.name,
          COUNT(*) AS count
        FROM items i
        JOIN status st ON st.id = i.status_id
        WHERE st.id <> 1
        GROUP BY st.id, st.name
        ORDER BY count DESC
      `),

      pool.query(`
        SELECT
          c.id,
          c.name,
          COUNT(*) AS count
        FROM items i
        JOIN \`condition\` c ON c.id = i.condition_id
        JOIN status st ON st.id = i.status_id
        WHERE st.id = 1
        GROUP BY c.id, c.name
        ORDER BY count DESC
      `),

      pool.query(`
        SELECT
          i.id,
          i.item_name,
          s.name AS service,
          l.name AS location,
          i.quantity,
          i.unit_price,
          (i.quantity * i.unit_price) AS total_value
        FROM items i
        JOIN service s ON s.id = i.service_id
        JOIN location l ON l.id = i.location_id
        JOIN status st ON st.id = i.status_id
        WHERE st.id = 1
        ORDER BY total_value DESC
        LIMIT 10
      `),
    ]);

    const summary = summaryRows[0];
    const disposed = disposedRows[0];

    res.json({
      summary: {
        totalValue: Number(summary.totalValue) || 0,
        activeItems: Number(summary.activeItems) || 0,
        totalQuantity: Number(summary.totalQuantity) || 0,
        disposedCount: Number(disposed.disposedCount) || 0,
        disposedValue: Number(disposed.disposedValue) || 0,
      },

      serviceValue: serviceValueRows.map((row) => ({
        id: row.id,
        name: row.name,
        value: Number(row.value) || 0,
      })),

      disposalBreakdown: disposalBreakdownRows.map((row) => ({
        id: row.id,
        name: row.name,
        count: Number(row.count) || 0,
      })),

      conditionBreakdown: conditionBreakdownRows.map((row) => ({
        id: row.id,
        name: row.name,
        count: Number(row.count) || 0,
      })),

      topItems: topItemsRows.map((row) => ({
        id: row.id,
        item_name: row.item_name,
        service: row.service,
        location: row.location,
        quantity: row.quantity,
        unit_price: Number(row.unit_price) || 0,
        total_value: Number(row.total_value) || 0,
      })),
    });

  } catch (err) {
    console.error("❌ Dashboard stats error:", err);
    res.status(500).json({
      error: "Błąd pobierania statystyk",
    });
  }
});

module.exports = router;