// context/ProjectContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';

const ProjectContext = createContext();

export const ProjectProvider = ({ children, projectId }) => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const [error, setError] = useState(null);

  // Load project data from localStorage on initial load if available
  useEffect(() => {
    const savedProject = localStorage.getItem('currentProject');
    if (savedProject) {
      try {
        setProject(JSON.parse(savedProject));
      } catch (e) {
        localStorage.removeItem('currentProject');
      }
    }
  }, []);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/project/${projectId}/dashboard`);
        const projectData = response.data.data;
        setProject(projectData);
        // Save to localStorage for persistence
        localStorage.setItem('currentProject', JSON.stringify(projectData));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch project data');
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchProjectData();
    } else {
      setLoading(false);
    }
  }, [projectId, token]);

  const updateProject = (updatedData) => {
    const newProject = { ...project, ...updatedData };
    setProject(newProject);
    localStorage.setItem('currentProject', JSON.stringify(newProject));
  };

  const value = {
    project,
    loading,
    error,
    updateProject
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};