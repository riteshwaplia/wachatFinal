
 const UserList = ({ users }) => (
    <ul className="space-y-2 mt-4">
        {users.map(user => (
            <li key={user._id} className="bg-gray-100 p-2 rounded">
                {user.username} ({user.email}) - {user.role}
            </li>
        ))}
    </ul>
);
export default UserList;