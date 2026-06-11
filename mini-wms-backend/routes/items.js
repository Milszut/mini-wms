const express = require('express');
const { pool } = require('../db');
const requireLogin = require('../middleware/requireLogin');
const { upload, convertHeicToJpeg, verifyRealImage } = require("../middleware/uploadImage");
const fs = require("fs");
const path = require("path");
const { itemSchema } = require("../validators/itemValidator");

const router = express.Router();

router.get('/', requireLogin, async (req, res) => {
  try {
    const {search, location, service, condition, status, sort} = req.query;

    let sql = `
      SELECT 
        i.id,
        i.entry_date,
        i.item_name,
        i.serial_number,
        i.quantity,
        i.unit_price,
        i.destination,
        l.name AS location,
        s.name AS service,
        c.name AS condition_name,
        st.name AS status,
        i.notes,
        i.image_path
      FROM items i
      LEFT JOIN location l ON i.location_id = l.id
      LEFT JOIN service s ON i.service_id = s.id
      LEFT JOIN \`condition\` c ON i.condition_id = c.id
      LEFT JOIN status st ON i.status_id = st.id
      WHERE i.quantity > 0
    `;

    const params = [];
    if (search) {
      sql += " AND (i.item_name LIKE ? OR i.serial_number LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }

    function addMultiFilter(value, column) {
      if (value === "") {
        sql += " AND 1=0 ";
        return;
      }

      if (!value) return;

      const ids = value.split(",").map(Number).filter(Boolean);
      if (ids.length === 0) {
        sql += " AND 1=0 ";
        return;
      }

      const placeholders = ids.map(() => "?").join(",");
      sql += ` AND ${column} IN (${placeholders})`;
      params.push(...ids);
    }

    addMultiFilter(location, "i.location_id");
    addMultiFilter(service, "i.service_id");
    addMultiFilter(condition, "i.condition_id");
    addMultiFilter(status, "i.status_id");

    const sortMap = {
      'name_asc': "i.item_name ASC",
      'name_desc': "i.item_name DESC",

      'price_asc': "i.unit_price ASC",
      'price_desc': "i.unit_price DESC",

      'quantity_asc': "i.quantity ASC",
      'quantity_desc': "i.quantity DESC",

      'date_asc': "i.entry_date ASC",
      'date_desc': "i.entry_date DESC",
    };

    if (sort && sortMap[sort]) {
      sql += ` ORDER BY ${sortMap[sort]}`;
    } else {
      sql += " ORDER BY i.entry_date DESC";
    }

    const [rows] = await pool.query(sql, params);

    res.json(rows);

  } catch (err) {
    console.error('❌ Błąd filtrowania:', err);
    res.status(500).json({ error: 'Błąd serwera przy pobieraniu danych' });
  }
});

router.get("/:id", requireLogin, async (req, res) => {
  try {

    const { id } = req.params;

    const [rows] = await pool.query(
      `
      SELECT 
        i.id,
        i.entry_date,
        i.item_name,
        i.serial_number,
        i.quantity,
        i.unit_price,
        i.location_id,
        i.service_id,
        i.condition_id,
        i.status_id,
        i.destination,
        l.name AS location,
        s.name AS service,
        c.name AS condition_name,
        st.name AS status,
        i.notes,
        i.image_path
      FROM items i
      LEFT JOIN location l ON i.location_id = l.id
      LEFT JOIN service s ON i.service_id = s.id
      LEFT JOIN \`condition\` c ON i.condition_id = c.id
      LEFT JOIN status st ON i.status_id = st.id
      WHERE i.id = ?
      `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({error: "Nie znaleziono przedmiotu",});
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("Błąd pobierania pojedynczego przedmiotu:",err);
    res.status(500).json({error: "Błąd serwera przy pobieraniu przedmiotu",});
  }
});

router.post("/", requireLogin, upload.single("file"), verifyRealImage, convertHeicToJpeg, async (req, res) => {
  try {
    for (const key in req.body) {
      if (req.body[key] === "") req.body[key] = null;
    }

    const safeNum = (v, defaultValue = null) => v === null ? defaultValue : Number(v);

    const body = {
      item_name: req.body.item_name,
      serial_number: req.body.serial_number,
      quantity: safeNum(req.body.quantity, 1),
      unit_price: safeNum(req.body.unit_price, 0),
      location_id: safeNum(req.body.location_id),
      service_id: safeNum(req.body.service_id),
      condition_id: safeNum(req.body.condition_id),
      status_id: safeNum(req.body.status_id),
      notes: req.body.notes,
      image_path: req.file ? `/uploads/${req.file.filename}` : null,
    };

    const { error } = itemSchema.validate(body, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        error: "Błąd walidacji danych!",
        details: error.details.map((d) => d.message),
      });
    }

    await pool.query(
      `
      INSERT INTO items (
        item_name, serial_number, quantity, unit_price,
        location_id, service_id, condition_id, status_id,
        notes, image_path, entry_date
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `,
      [
        body.item_name,
        body.serial_number,
        body.quantity,
        body.unit_price,
        body.location_id,
        body.service_id,
        body.condition_id,
        body.status_id,
        body.notes,
        body.image_path,
      ]
    );

    res.status(201).json({ message: "Przedmiot dodany pomyślnie!" });
  } catch (err) {
    console.error("REAL BACKEND ERROR:", err);
    res.status(500).json({
      error: "Błąd serwera przy dodawaniu przedmiotu!",
      details: err.message,
    });
  }
});

router.put("/:id", requireLogin, upload.single("file"), verifyRealImage, convertHeicToJpeg, async (req, res) => {
    const itemId = req.params.id;

    try {
      const removeImage = req.body.remove_image === "true";

      for (const key in req.body) {
        if (req.body[key] === "") {
          req.body[key] = null;
        }
      }

      const safeNum = (v, defaultValue = null) => v === null ? defaultValue : Number(v);

      const [rows] = await pool.query(
        "SELECT image_path FROM items WHERE id = ?",
        [itemId]
      );

      if (rows.length === 0) {
        return res.status(404).json({error: "Nie znaleziono przedmiotu!",});
      }

      let oldImage = null;
      
      if (rows[0]?.image_path) {
        const cleanPath = rows[0].image_path.replace(/^\//, "");
        oldImage = path.join(__dirname,"..",cleanPath);
      }

      const body = {
        item_name: req.body.item_name,
        serial_number: req.body.serial_number,
        quantity: safeNum(req.body.quantity, 1),
        unit_price: safeNum(req.body.unit_price, 0),
        location_id: safeNum(req.body.location_id),
        service_id: safeNum(req.body.service_id),
        condition_id: safeNum(req.body.condition_id),
        status_id: safeNum(req.body.status_id),
        notes: req.body.notes,
        image_path: req.file ? `/uploads/${req.file.filename}` : removeImage ? null : undefined,
      };

      const validationBody = {
        ...body, image_path: body.image_path ?? rows[0].image_path,
      };

      const { error } = itemSchema.validate(
        validationBody, { abortEarly: false }
      );

      if (error) {
        return res.status(400).json({error: "Błąd walidacji danych!", details: error.details.map((d) => d.message),});
      }

      if ((req.file || removeImage) && oldImage && fs.existsSync(oldImage)) {
        fs.unlinkSync(oldImage);
      }

      await pool.query(
        `
        UPDATE items SET
          item_name = ?,
          serial_number = ?,
          quantity = ?,
          unit_price = ?,
          location_id = ?,
          service_id = ?,
          condition_id = ?,
          status_id = ?,
          notes = ?,
          image_path = ?
        WHERE id = ?
        `,
        [
          body.item_name,
          body.serial_number,
          body.quantity,
          body.unit_price,

          body.location_id,
          body.service_id,
          body.condition_id,
          body.status_id,

          body.notes,

          body.image_path === undefined
            ? rows[0].image_path
            : body.image_path,

          itemId,
        ]
      );

      res.json({message:"Przedmiot zaktualizowany pomyślnie!",});
      
    } catch (err) {
      console.error("Błąd przy aktualizacji przedmiotu:",err);

      res.status(500).json({error:"Błąd serwera przy aktualizacji przedmiotu!", details: err.message,});
    }
  }
);

router.post("/:id/dispose", requireLogin, async (req, res) => {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const parentId = req.params.id;
      const { quantity, status_id, destination, notes,} = req.body;

      if (!status_id) {
        return res.status(400).json({error: "Wybierz nowy status!",});
      }

      if (!destination || !destination.trim()) {
        return res.status(400).json({error: "Podaj lokalizację docelową!",});
      }

      const disposeQty = Number(quantity);

      if (!disposeQty || disposeQty <= 0) {
        return res.status(400).json({error: "Nieprawidłowa ilość!",});
      }

      const [rows] = await connection.query(`SELECT * FROM items WHERE id = ?`, [parentId]);

      if (rows.length === 0) {
        return res.status(404).json({error: "Nie znaleziono przedmiotu!",});
      }

      const parent = rows[0];

      const [parentStatusRows] = await connection.query(`SELECT name FROM status WHERE id = ?`, [parent.status_id]);

      if (parentStatusRows.length === 0) {
        return res.status(400).json({error: "Nieprawidłowy status przedmiotu!",});
      }

      const parentStatus = parentStatusRows[0].name?.toLowerCase();

      if (parentStatus !== "na stanie") {
        return res.status(400).json({error: "Likwidacja możliwa tylko dla przedmiotów ze statusem 'Na stanie'!",});
      }

      const [statusRows] = await connection.query(`SELECT name FROM status WHERE id = ?`, [status_id]);

      if (statusRows.length === 0) {
        return res.status(400).json({error:"Nieprawidłowy status!",});
      }

      const targetStatus = statusRows[0].name?.toLowerCase();

      if (Number(parent.status_id) === Number(status_id)) {
        return res.status(400).json({error: "Nowy status musi być inny niż obecny!",});
      }

      if (targetStatus === "na stanie") {
        return res.status(400).json({error: "Nie można wykonać operacji ze statusem 'Na stanie'!",});
      }

      if (disposeQty > parent.quantity) {
        return res.status(400).json({error: "Ilość większa niż stan magazynowy!",});
      }

      const remaining = parent.quantity - disposeQty;

      await connection.query(`UPDATE items SET quantity = ? WHERE id = ?`, [remaining, parentId,]);

      const [insertResult] = await connection.query(
          `
          INSERT INTO items (
            parent_id,
            entry_date,
            operation_date,
            item_name,
            serial_number,
            quantity,
            unit_price,
            location_id,
            service_id,
            condition_id,
            status_id,
            destination,
            image_path,
            notes
          )
          VALUES (
            ?,
            ?, NOW(),
            ?, ?,
            ?, ?,
            ?, ?, ?, ?,
            ?,
            ?, ?
          )
          `,
          [
            parent.id,
            new Date(),
            parent.item_name,
            parent.serial_number,
            disposeQty,
            parent.unit_price,
            parent.location_id,
            parent.service_id,
            parent.condition_id,
            status_id,
            destination.trim(),
            parent.image_path,
            notes || null,
          ]
        );

      await connection.commit();

      res.json({message: "Operacja wykonana pomyślnie!", child_id: insertResult.insertId,});

    } catch (err) {

      await connection.rollback();
      console.error("Błąd likwidacji:", err);
      res.status(500).json({error: "Błąd serwera przy likwidacji!", details: err.message,});
    } finally {
      connection.release();
    }
  }
);

router.post("/:id/restore", requireLogin, async (req, res) => {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const childId = req.params.id;
      const { quantity, restore_notes } = req.body;
      const restoreQty = Number(quantity);

      if (!restoreQty || restoreQty <= 0) {
        return res.status(400).json({error: "Nieprawidłowa ilość!",});
      }

      const [childRows] = await connection.query(`SELECT * FROM items WHERE id = ?`, [childId]);

      if (childRows.length === 0) {
        return res.status(404).json({error: "Nie znaleziono rekordu!",});
      }

      const child = childRows[0];

      if (!child.parent_id) {
        return res.status(400).json({error: "Ten rekord nie posiada parent_id!",});
      }

      if (restoreQty > child.quantity) {
        return res.status(400).json({error: "Ilość większa niż dostępna!",});
      }

      const [parentRows] = await connection.query(`SELECT * FROM items WHERE id = ?`, [child.parent_id]);

      if (parentRows.length === 0) {
        return res.status(404).json({error: "Nie znaleziono rekordu nadrzędnego!",});
      }

      const parent = parentRows[0];
      const notesParts = [];

      if (parent.notes?.trim()) {
        notesParts.push(parent.notes.trim());
      }

      if (child.notes?.trim()) {
        const previousOperationNote = `(Z poprzedniej operacji)\n${child.notes.trim()}`;
        if (!parent.notes?.includes(previousOperationNote)) {
          notesParts.push(previousOperationNote);
        }
      }

      if (restore_notes?.trim()) {
        notesParts.push(`(Powrót)\n${restore_notes.trim()}`);
      }

      const mergedNotes = notesParts.join("\n\n");
      await connection.query(`UPDATE items SET quantity = ?, notes = ? WHERE id = ?`, [parent.quantity + restoreQty, mergedNotes, parent.id,]);

      if (restoreQty === child.quantity) {
        await connection.query(`DELETE FROM items WHERE id = ?`, [child.id]);
      } else {
        await connection.query(`UPDATE items SET quantity = ? WHERE id = ?`, [child.quantity - restoreQty,child.id,]);
      }

      await connection.commit();
      res.json({message: "Przedmiot został przywrócony!",});
    } catch (err) {
      await connection.rollback();
      console.error("Błąd przywracania:", err);
      res.status(500).json({error: "Błąd serwera przy przywracaniu!", details: err.message,});
    } finally {
      connection.release();
    }
  }
);

module.exports = router;
