import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import newRequest from '../api/newReqest';
import { useUserContext } from './useUserContext';

const ProjectContext = createContext();

export const useProjectContext = () => useContext(ProjectContext);

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const { user } = useUserContext();
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const colorGradients = [
    selectedProject?.projectColor?.gradient1 || '',
    selectedProject?.projectColor?.gradient2 || '',
  ];

  const members = useMemo(() => {
    return selectedProject?.members?.map((member) => member.user.name);
  }, [selectedProject]);

  useEffect(() => {
    fetchProjects();
  }, [user]);

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
      setProjects(response);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  }, []);

  const addProject = useCallback(async (projectData) => {
    try {
      const response = await newRequest.post('/projects', projectData);
      setProjects((prevProjects) => [...prevProjects, response]);
      // update the selected project
      setSelectedProject(response);

      toast.success('Project created successfully');
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
        if (projects.length <= 1) {
          toast.error('Cannot delete the last project');
          return;
        }

        await newRequest.delete(`/projects/${projectId}`);
        setProjects((prevProjects) => prevProjects.filter((project) => project._id !== projectId));

        if (selectedProject && selectedProject._id === projectId) {
          const newSelectedProject = projects.find((p) => p._id !== projectId);
          setSelectedProject(newSelectedProject);
          localStorage.setItem('selectedProjectId', newSelectedProject._id);
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

  const value = {
    projects,
    fetchProjects,
    updateProject,
    deleteProject,
    selectedProject,
    setSelectedProject: setSelectedProjectAndSave,
    openModal,
    isModalOpen,
    closeModal,
    addProject,
    members,
    colorGradients,
  };

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
};

export default ProjectProvider;
