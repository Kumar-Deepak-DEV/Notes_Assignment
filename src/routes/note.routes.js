const express = require('express');
const router = express.Router();
const {
  createNote,
  createBulkNotes,
} = require('../controllers/note.controller');

router.post("/bulk", createBulkNotes);
router.delete("/bulk", deleteBulkNotes);

module.exports = router;
