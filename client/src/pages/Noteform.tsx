import React, { useState, useEffect } from 'react';
import API from '../utils/api';

interface Note {
  _id: string;
  title: string;
  content: string;
}

interface Props {
  existingNote: Note | null;
  onSuccess: () => void;
}

const NoteForm = ({ existingNote, onSuccess }: Props) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (existingNote) {
      setTitle(existingNote.title);
      setContent(existingNote.content);
    } else {
      setTitle('');
      setContent('');
    }
  }, [existingNote]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (existingNote) {
        // update
        await API.put(`/notes/${existingNote._id}`, { title, content });
      } else {
        // create
        await API.post('/notes', { title, content });
      }
      onSuccess();
      setTitle('');
      setContent('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow-md">
      <h3 className="text-xl font-semibold mb-2">
        {existingNote ? 'Edit Note' : 'Create Note'}
      </h3>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="title" className="block mb-1">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="content" className="block mb-1">
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded"
            rows={3}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {existingNote ? 'Update Note' : 'Add Note'}
        </button>
      </form>
    </div>
  );
};

export default NoteForm;
