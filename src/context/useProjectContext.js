import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import newRequest from '../api/newReqest';
import { useUserContext } from './useUserContext';

const ProjectContext = createContext();

export const useProjectContext = () => useContext(ProjectContext);

export const ProjectProvider = ({ children }) => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useUserContext();
  const queryClient = useQueryClient();

  const colorGradients = [
    selectedProject?.projectColor?.gradient1 || '',
    selectedProject?.projectColor?.gradient2 || '',
  ];

  const { data: projects = [], refetch: fetchProjects } = useQuery(
    'projects',
    async () => {
      const response = await newRequest.get('/projects');
      return response;
    },
    {
      onSuccess: (data) => {
        const storedSelectedProjectId = localStorage.getItem('selectedProjectId');
        if (storedSelectedProjectId && data.length > 0) {
          const project = data.find((p) => p._id === storedSelectedProjectId);
          if (project) {
            setSelectedProject(project);
          } else {
            setSelectedProject(data[0]);
            localStorage.setItem('selectedProjectId', data[0]._id);
          }
        } else if (data.length > 0) {
          setSelectedProject(data[0]);
          localStorage.setItem('selectedProjectId', data[0]._id);
        }
      },
      enabled: !!user,
    },
  );

  const members = useMemo(() => {
    return selectedProject?.members?.map((member) => member.user?.name);
  }, [selectedProject]);

  const addProjectMutation = useMutation(
    async (projectData) => {
      if (projects.length >= 7) {
        throw new Error('Maximum of 7 projects allowed');
      }
      const response = await newRequest.post('/projects', projectData);
      return response;
    },
    {
      onSuccess: (response) => {
        queryClient.setQueryData('projects', (oldData) => [...oldData, response]);
        setSelectedProject(response);
        toast.success('Project created successfully');
      },
      onError: (error) => {
        console.error('Error adding project:', error);
        toast.error(error.message);
      },
    },
  );

  const updateProjectMutation = useMutation(
    async ({ projectId, updatedData }) => {
      if (!projectId) {
        toast.error('Project ID is required');
        return;
      }
      if (projects.length >= 8) {
        toast.error('Maximum of 8 projects allowed');
        return;
      }

      const response = await newRequest.put(`/projects/${projectId}`, updatedData);
      return response;
    },
    {
      onSuccess: (response) => {
        queryClient.setQueryData('projects', (oldData) =>
          oldData.map((project) => (project._id === response._id ? response : project)),
        );
      },
      onError: (error) => {
        console.error('Error updating project:', error);
      },
    },
  );

  const deleteProjectMutation = useMutation(
    async (projectId) => {
      if (projects.length <= 1) {
        throw new Error('Cannot delete the last project');
      }
      await newRequest.delete(`/projects/${projectId}`);
      return projectId;
    },
    {
      onSuccess: (deletedProjectId) => {
        queryClient.setQueryData('projects', (oldData) =>
          oldData.filter((project) => project._id !== deletedProjectId),
        );
        if (selectedProject && selectedProject._id === deletedProjectId) {
          const newSelectedProject = projects.find((p) => p._id !== deletedProjectId);
          setSelectedProject(newSelectedProject);
          localStorage.setItem('selectedProjectId', newSelectedProject._id);
        }
      },
      onError: (error) => {
        console.error('Error deleting project:', error);
        toast.error(error.message);
      },
    },
  );

  const setSelectedProjectAndSave = useCallback((project) => {
    setSelectedProject(project);
    localStorage.setItem('selectedProjectId', project._id);
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const value = {
    projects,
    addProject: addProjectMutation.mutate,
    updateProject: updateProjectMutation.mutate,
    deleteProject: deleteProjectMutation.mutate,
    selectedProject,
    setSelectedProject: setSelectedProjectAndSave,
    openModal,
    isModalOpen,
    closeModal,
    members,
    colorGradients,
    fetchProjects,
  };

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
};

export default ProjectProvider;
