const mongoose = require('mongoose');
const Note = require('../models/note.model');

// Helper to check valid mongo id
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// 1. POST /api/notes — Create a note
const createNote = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required",
        data: null
      });
    }

    const note = await Note.create(req.body);
    res.status(201).json({
      success: true,
      message: "Note created successfully",
      data: note
    });
  } catch (error) {
    next(error);
  }
};

// 2. POST /api/notes/bulk — Create multiple notes
const createBulkNotes = async (req, res, next) => {
  try {
    const { notes } = req.body;
    if (!notes || !Array.isArray(notes) || notes.length === 0) {
      return res.status(400).json({
        success: false,
        message: "notes array is required and cannot be empty",
        data: null
      });
    }

    // Optional validation for individual notes inside the bulk request
    for (const note of notes) {
      if (!note.title || !note.content) {
        return res.status(400).json({
          success: false,
          message: "Title and content are required",
          data: null
        });
      }
    }

    const insertedNotes = await Note.insertMany(notes);
    res.status(201).json({
      success: true,
      message: `${insertedNotes.length} notes created successfully`,
      data: insertedNotes
    });
  } catch (error) {
    next(error);
  }
};