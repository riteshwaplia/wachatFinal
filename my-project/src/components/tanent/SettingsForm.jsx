import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";

const SettingsForm = ({ initialSettings }) => {
    const [settings, setSettings] = useState(initialSettings);
    const { token } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await api.put(`/tenants/${settings._id}`, settings, {
            headers: { Authorization: `Bearer ${token}` }
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <input value={settings.websiteName} onChange={e => setSettings({ ...settings, websiteName: e.target.value })} />
            <input value={settings.faviconUrl} onChange={e => setSettings({ ...settings, faviconUrl: e.target.value })} />
            <button type="submit">Update</button>
        </form>
    );
};
export default SettingsForm;