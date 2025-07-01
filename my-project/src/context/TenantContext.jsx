// src/context/TenantContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api'; // <--- CHANGE THIS IMPORT PATH

const TenantContext = createContext();

export const useTenant = () => useContext(TenantContext);

export const TenantProvider = ({ children }) => {
    const [siteConfig, setSiteConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSiteConfig = async () => {
            try {
                const response = await api.get('/site/config'); 
                setSiteConfig(response.data);
            } catch (err) {
                console.error("Failed to fetch site config:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchSiteConfig();
    }, []);

    // Dynamically update favicon
    useEffect(() => {
        if (siteConfig && siteConfig.faviconUrl) {
            let link = document.querySelector("link[rel~='icon']");
            if (!link) {
                link = document.createElement('link');
                link.rel = 'icon';
                document.getElementsByTagName('head')[0].appendChild(link);
            }
            link.href = siteConfig.faviconUrl;
        }
    }, [siteConfig]);

    return (
        <TenantContext.Provider value={{ siteConfig, loading, error }}>
            {children}
        </TenantContext.Provider>
    );
};