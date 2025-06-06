import React, { useContext, useEffect, useState } from 'react';
import API from '../utils/api';
import { AuthContext } from '../context/AuthContext';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
}

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const res = await API.get('/admin/users');
      setUsers(res.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load users');
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchUsers();
    }
  }, [user]);

  if (!user || user.role !== 'admin') {
    return <p className="text-center text-red-500">Not authorized</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard - All Users</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <table className="min-w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4">Name</th>
            <th className="py-2 px-4">Email</th>
            <th className="py-2 px-4">Role</th>
            <th className="py-2 px-4">Joined</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id} className="border-b">
              <td className="py-2 px-4">{u.name}</td>
              <td className="py-2 px-4">{u.email}</td>
              <td className="py-2 px-4">{u.role}</td>
              <td className="py-2 px-4">
                {new Date(u.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
