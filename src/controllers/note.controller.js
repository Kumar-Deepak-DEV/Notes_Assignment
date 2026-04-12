const mongoose = require('mongoose');
const Note = require('../models/note.model');

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const deleteBulkNotes = async (req, res, next) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "ids array is required and cannot be empty",
        data: null
      });
    }

    for (const id of ids) {
      if (!isValidId(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid note ID",
          data: null
        });
      }
    }

    const deleteResult = await Note.deleteMany({ _id: { $in: ids } });
    res.status(200).json({
      success: true,
      message: `${deleteResult.deletedCount} notes deleted successfully`,
      data: null
    });
  } catch (error) {
    next(error);
  }
};

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

const getNotesByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const allowedCategories = ["work", "personal", "study"];
    if (!allowedCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category. Allowed: work, personal, study",
        data: null
      });
    }

    const notes = await Note.find({ category });
    if (notes.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No notes found for category: ${category}`,
        data: null
      });
    }

    res.status(200).json({
      success: true,
      message: `Notes fetched for category: ${category}`,
      count: notes.length,
      data: notes
    });
  } catch (error) {
    next(error);
  }
};


const getNotesByStatus = async (req, res, next) => {
  try {
    const { isPinned } = req.params;
    if (isPinned !== "true" && isPinned !== "false") {
      return res.status(400).json({
        success: false,
        message: "isPinned must be true or false",
        data: null
      });
    }

    const pinned = isPinned === "true";
    const notes = await Note.find({ isPinned: pinned });

    res.status(200).json({
      success: true,
      message: pinned ? "Fetched all pinned notes" : "Fetched all unpinned notes",
      count: notes.length,
      data: notes
    });
  } catch (error) {
    next(error);
  }
};


module.exports = {
  createBulkNotes,
  deleteBulkNotes,
  getNotesByCategory,
  getNotesByStatus,
  };
