import React, { useState, useEffect, useContext } from 'react';
import API from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import NoteForm from './Noteform';

interface Note {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
}

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [notes, setNotes] = useState<Note[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const fetchNotes = async () => {
    try {
      const res = await API.get('/notes');
      setNotes(res.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load notes');
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await API.delete(`/notes/${id}`);
      setNotes(notes.filter((note) => note._id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete');
    }
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note);
  };

  const handleFormSuccess = () => {
    setEditingNote(null);
    fetchNotes();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">
        Hello, {user?.name}. Your Notes:
      </h2>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <NoteForm
        existingNote={editingNote}
        onSuccess={handleFormSuccess}
      />

      <div className="mt-6 grid md:grid-cols-2 gap-4">
        {notes.map((note) => (
          <div
            key={note._id}
            className="bg-white p-4 rounded shadow relative"
          >
            <h3 className="font-semibold">{note.title}</h3>
            <p className="mt-2">{note.content}</p>
            <div className="absolute top-2 right-2 flex space-x-2">
              <button
                onClick={() => handleEdit(note)}
                className="text-blue-500 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(note._id)}
                className="text-red-500 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
