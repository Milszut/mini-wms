require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { pool } = require("./db");

async function importTable(tableName) {
  const filePath = path.join(__dirname, "seed", `${tableName}.json`);
  const rows = JSON.parse(fs.readFileSync(filePath, "utf8"));

  for (const row of rows) {
    const columns = Object.keys(row);

    const values = Object.values(row).map(value => {
      if (
        typeof value === "string" &&
        /^\d{4}-\d{2}-\d{2}T/.test(value)
      ) {
        return value
          .replace("T", " ")
          .replace(".000Z", "");
      }

      return value;
    });

    const placeholders = columns.map(() => "?").join(",");

    await pool.query(
      `INSERT INTO \`${tableName}\` (${columns.join(",")}) VALUES (${placeholders})`,
      values
    );
  }

  console.log(`${tableName}.json imported`);
}

async function resetDatabase() {
  try {
    await pool.query("SET FOREIGN_KEY_CHECKS=0");

    await pool.query("TRUNCATE TABLE `items`");
    await pool.query("TRUNCATE TABLE `location`");
    await pool.query("TRUNCATE TABLE `service`");
    await pool.query("TRUNCATE TABLE `condition`");
    await pool.query("TRUNCATE TABLE `status`");

    await pool.query("SET FOREIGN_KEY_CHECKS=1");

    await importTable("location");
    await importTable("service");
    await importTable("condition");
    await importTable("status");
    await importTable("items");

    console.log("Database reset completed.");
  } catch (err) {
    console.error(err);
    throw err;
  }
}

module.exports = resetDatabase;

if (require.main === module) {
  resetDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}