import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import newRequest from '../api/newReqest';

const ProjectContext = createContext();

export const useProjectContext = () => useContext(ProjectContext);

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    const storedSelectedProjectId = localStorage.getItem('selectedProjectId');
    if (storedSelectedProjectId && projects.length > 0) {
      const project = projects.find((p) => p._id === storedSelectedProjectId);
      if (project) {
        setSelectedProject(project);
      } else {
        setSelectedProject(projects[0]);
        localStorage.setItem('selectedProjectId', projects[0]._id);
      }
    } else if (projects.length > 0) {
      setSelectedProject(projects[0]);
      localStorage.setItem('selectedProjectId', projects[0]._id);
    }
  }, [projects]);

  const fetchProjects = useCallback(async () => {
    try {
      const response = await newRequest.get('/projects');
      console.log('🚀  response:', response);
      setProjects(response);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  }, []);

  const addProject = useCallback(async (projectData) => {
    try {
      const response = await newRequest.post('/projects', projectData);
      setProjects((prevProjects) => [...prevProjects, response]);
      return response;
    } catch (error) {
      console.error('Error adding project:', error);
      throw error;
    }
  }, []);

  const updateProject = useCallback(async (projectId, updatedData) => {
    try {
      const response = await newRequest.put(`/projects/${projectId}`, updatedData);
      setProjects((prevProjects) =>
        prevProjects.map((project) => (project._id === projectId ? response : project)),
      );
      return response;
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  }, []);

  const deleteProject = useCallback(
    async (projectId) => {
      try {
        await newRequest.delete(`/projects/${projectId}`);
        setProjects((prevProjects) => prevProjects.filter((project) => project._id !== projectId));
        if (selectedProject && selectedProject._id === projectId) {
          const newSelectedProject = projects.find((p) => p._id !== projectId) || null;
          setSelectedProject(newSelectedProject);
          localStorage.setItem(
            'selectedProjectId',
            newSelectedProject ? newSelectedProject._id : '',
          );
        }
      } catch (error) {
        console.error('Error deleting project:', error);
        throw error;
      }
    },
    [projects, selectedProject],
  );

  const setSelectedProjectAndSave = useCallback((project) => {
    setSelectedProject(project);
    localStorage.setItem('selectedProjectId', project._id);
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (newProjectName.trim()) {
      await addProject({ name: newProjectName.trim() });
      setNewProjectName('');
      closeModal();
    }
  };

  const value = {
    projects,
    fetchProjects,
    addProject,
    updateProject,
    deleteProject,
    selectedProject,
    setSelectedProject: setSelectedProjectAndSave,
    openModal,
    isModalOpen,
    closeModal,
  };

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
};

export default ProjectProvider;
