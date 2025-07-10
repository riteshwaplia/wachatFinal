import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import Input from '../../components/InputField';
import Table from '../../components/Table';

const TenantUsersPage = () => {
  const { token, login } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: ''
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await api.get('/users', config);
      setUsers(res.data);
    } catch (error) {
      console.error('Failed to fetch users', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(
        '/users/admin-register',
        { ...form, role: 'user' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsModalOpen(false);
      setForm({ username: '', email: '', password: '' });
      fetchUsers();
    } catch (error) {
      console.error('Failed to create user', error);
    }
  };

  const handleLoginAsUser = async (userId) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await api.post(`/users/impersonate/${userId}`, {}, config);
      login(res.data.token);
    } catch (error) {
      console.error('Failed to login as user', error);
    }
  };

  const columns = [
    { header: 'Username', accessor: 'username' },
    { header: 'Email', accessor: 'email' },
    { 
      header: 'Role', 
      accessor: 'role',
      cell: (value) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          value === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
        }`}>
          {value}
        </span>
      )
    },
    {
      header: 'Actions',
      cell: (_, row) => (
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => handleLoginAsUser(row._id)}
          >
            Login As
          </Button>
          {/* <Button size="sm" variant="outline">
            Edit
          </Button>
          <Button size="sm" variant="danger">
            Delete
          </Button> */}
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          Create User
        </Button>
      </div>

      <Table
        columns={columns}
        data={users}
        loading={loading}
        emptyMessage="No users found"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New User"
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              label="Username"
              name="username"
              value={form.username}
              onChange={handleInputChange}
              required
            />
            <Input
              label="Email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleInputChange}
              required
            />
            <Input
              label="Password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <Button 
              variant="outline" 
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              Create User
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TenantUsersPage;