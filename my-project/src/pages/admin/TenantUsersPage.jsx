import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { useTenant } from '../../context/TenantContext';
import UserList from '../../components/tanent/UserList';
import CreateUserForm from '../../components/tanent/CreateUserForm';

const TenantUsersPage = () => {
    const { token } = useAuth();
    const [users, setUsers] = useState([]);
    const [refresh, setRefresh] = useState(false);

    const fetchUsers = async () => {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await api.get('/users', config);
        setUsers(res.data);
    };

    useEffect(() => {
        fetchUsers();
    }, [refresh]);

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Manage Users</h2>
            <CreateUserForm onSuccess={() => setRefresh(!refresh)} />
            <UserList users={users} />
        </div>
    );
};

export default TenantUsersPage;



