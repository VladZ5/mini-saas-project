const asyncHandler = require('express-async-handler');
const Note = require('../models/Note');

// @desc    Get notes for logged-in user
// @route   GET /api/notes
// @access  Private
exports.getNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find({ user: req.user.id });
  res.status(200).json({ success: true, count: notes.length, data: notes });
});

// @desc    Create a note
// @route   POST /api/notes
// @access  Private
exports.createNote = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    res.status(400);
    throw new Error('Please include title and content');
  }

  const note = await Note.create({
    title,
    content,
    user: req.user.id
  });

  res.status(201).json({ success: true, data: note });
});

// @desc    Update a note
// @route   PUT /api/notes/:id
// @access  Private
exports.updateNote = asyncHandler(async (req, res) => {
  let note = await Note.findById(req.params.id);

  if (!note) {
    res.status(404);
    throw new Error('Note not found');
  }

  // ensure user owns note
  if (note.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not authorized to update this note');
  }

  note = await Note.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({ success: true, data: note });
});

// @desc    Delete a note
// @route   DELETE /api/notes/:id
// @access  Private
exports.deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    res.status(404);
    throw new Error('Note not found');
  }

  // ensure user owns note
  if (note.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not authorized to delete this note');
  }

  await note.remove();
  res.status(200).json({ success: true, data: {} });
});
