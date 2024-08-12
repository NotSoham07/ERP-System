import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { useAuth } from './AuthContext';  // Import useAuth to access user roles
import './index.css';

function Projects() {
  const { roles } = useAuth();  // Get the user's roles from the AuthContext
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editingProject, setEditingProject] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProjects();

    const subscription = supabase
      .channel('public:Projects')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'Projects' }, (payload) => {
        console.log('Change received!', payload);
        fetchProjects();  // Re-fetch projects whenever a change is detected
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const fetchProjects = async () => {
    const { data, error } = await supabase.from('Projects').select('*');
    if (error) {
      setError('Error fetching projects');
      console.error(error.message);
    } else {
      setProjects(data || []);
    }
  };

  const validateForm = () => {
    if (!name || !description) {
      setError('All fields are required');
      return false;
    }
    setError(null);
    return true;
  };

  const addProject = async () => {
    if (!validateForm()) return;

    const { data, error } = await supabase.from('Projects').insert([
      { name, description }
    ]);

    if (error) {
      setError('Error adding project');
      console.error(error.message);
      return;
    }

    if (data && data.length > 0) {
      setProjects([...projects, data[0]]);
    } else {
      setError('No data returned from the server');
    }
    resetForm();
  };

  const updateProject = async () => {
    if (!validateForm()) return;

    const { data, error } = await supabase.from('Projects').update({
      name, description
    }).eq('id', editingProject.id);

    if (error) {
      setError('Error updating project');
      console.error(error.message);
      return;
    }

    if (data && data.length > 0) {
      setProjects(projects.map(project => (project.id === editingProject.id ? data[0] : project)));
    } else {
      setError('No data returned from the server');
    }
    resetForm();
  };

  const deleteProject = async (id) => {
    const { error } = await supabase.from('Projects').delete().eq('id', id);
    if (error) {
      setError('Error deleting project');
      console.error(error.message);
    } else {
      setProjects(projects.filter(project => project.id !== id));
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setEditingProject(null);
    setError(null);
  };

  return (
    <div className="content">
      <h2 className="text-2xl font-bold mb-6">Projects Module</h2>
      {error && <div className="error text-red-500 mb-4">{error}</div>}
      {(roles.includes('admin') || roles.includes('manager')) ? (
        <>
          <input
            type="text"
            className="border border-gray-300 p-2 mb-4 w-full"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            className="border border-gray-300 p-2 mb-4 w-full"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button onClick={editingProject ? updateProject : addProject} className="bg-blue-500 text-white p-2 rounded">
            {editingProject ? 'Update Project' : 'Add Project'}
          </button>
        </>
      ) : (
        <p>You do not have permission to add or edit projects.</p>
      )}
      <table className="table-auto w-full mt-6">
        <thead>
          <tr>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Description</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map(project => (
            <tr key={project.id} className="bg-gray-200">
              <td className="border px-4 py-2">{project.name}</td>
              <td className="border px-4 py-2">{project.description}</td>
              <td className="border px-4 py-2">
                {(roles.includes('admin') || roles.includes('manager')) ? (
                  <>
                    <button className="bg-green-500 text-white p-1 rounded mr-2" onClick={() => {
                      setName(project.name);
                      setDescription(project.description);
                      setEditingProject(project);
                    }}>Edit</button>
                    <button className="bg-red-500 text-white p-1 rounded" onClick={() => deleteProject(project.id)}>Delete</button>
                  </>
                ) : (
                  <p>You do not have permission to perform actions on this project.</p>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Projects;
