import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";

const CreateUserForm = ({ onSuccess }) => {
    const { token } = useAuth();
    const [form, setForm] = useState({ username: '', email: '', password: '' });

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        await api.post('/users/admin-register', { ...form, role: 'user' }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setForm({ username: '', email: '', password: '' });
        onSuccess();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-2">
            <input name="username" value={form.username} onChange={handleChange} required />
            <input name="email" type="email" value={form.email} onChange={handleChange} required />
            <input name="password" type="password" value={form.password} onChange={handleChange} required />
            <button type="submit">Create User</button>
        </form>
    );
};
export default CreateUserForm;