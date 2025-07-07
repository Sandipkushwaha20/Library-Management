import React, { useEffect, useState } from 'react';
import { booksAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function UpdateBookCovers() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [coverUrl, setCoverUrl] = useState('');

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await booksAPI.getAll({});
      setBooks(res.data.data);
    } catch (err) {
      toast.error('Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (book) => {
    setEditingId(book._id);
    setCoverUrl(book.coverImage || '');
  };

  const handleUpdate = async (id) => {
    if (!coverUrl.trim()) return toast.error('Cover URL required');
    try {
      await booksAPI.updateCover(id, coverUrl);
      toast.success('Cover updated');
      setEditingId(null);
      setCoverUrl('');
      fetchBooks();
    } catch (err) {
      toast.error('Failed to update cover');
    }
  };

  return (
    <div className="max-w-3xl mx-auto card p-8 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Update Book Covers</h1>
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Current Cover</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {books.map(book => (
              <tr key={book._id}>
                <td className="px-4 py-2">{book.title}</td>
                <td className="px-4 py-2">
                  {book.coverImage ? (
                    <img src={book.coverImage} alt={book.title} className="h-16 w-12 object-cover rounded" />
                  ) : (
                    <span className="text-gray-400">No cover</span>
                  )}
                </td>
                <td className="px-4 py-2">
                  {editingId === book._id ? (
                    <>
                      <input
                        type="url"
                        className="input-field mr-2"
                        value={coverUrl}
                        onChange={e => setCoverUrl(e.target.value)}
                        placeholder="https://..."
                        autoFocus
                      />
                      <button className="btn-primary mr-2" onClick={() => handleUpdate(book._id)}>Save</button>
                      <button className="btn-secondary" onClick={() => setEditingId(null)}>Cancel</button>
                    </>
                  ) : (
                    <button className="btn-secondary" onClick={() => handleEdit(book)}>Edit Cover</button>
                  )}
                </td>
              </tr>
            ))}
            {books.length === 0 && (
              <tr><td colSpan={3} className="text-center py-8 text-gray-500">No books found.</td></tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
} 