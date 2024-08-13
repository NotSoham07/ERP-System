import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { useAuth } from './AuthContext';
import {
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from '@mui/material';

function Projects() {
  const { roles } = useAuth();
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
        fetchProjects();
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
      <Typography variant="h4" gutterBottom>Projects Module</Typography>
      {error && <Typography color="error" gutterBottom>{error}</Typography>}
      {(roles.includes('admin') || roles.includes('manager')) ? (
        <>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={editingProject ? updateProject : addProject}
            sx={{ mt: 2 }}
          >
            {editingProject ? 'Update Project' : 'Add Project'}
          </Button>
        </>
      ) : (
        <Typography>You do not have permission to add or edit projects.</Typography>
      )}
      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>

        <TableHead>
  <TableRow>
    <TableCell>
      <Typography variant="body1" fontWeight="bold">
        Name
      </Typography>
    </TableCell>
    <TableCell>
      <Typography variant="body1" fontWeight="bold">
        Description
      </Typography>
    </TableCell>
    <TableCell>
      <Typography variant="body1" fontWeight="bold">
        Actions
      </Typography>
    </TableCell>
  </TableRow>
</TableHead>


          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map(project => (
              <TableRow key={project.id}>
                <TableCell>{project.name}</TableCell>
                <TableCell>{project.description}</TableCell>
                <TableCell>
                  {(roles.includes('admin') || roles.includes('manager')) ? (
                    <>
                      <Button
                        variant="outlined"
                        color="success"
                        onClick={() => {
                          setName(project.name);
                          setDescription(project.description);
                          setEditingProject(project);
                        }}
                        sx={{ mr: 1 }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => deleteProject(project.id)}
                      >
                        Delete
                      </Button>
                    </>
                  ) : (
                    <Typography>No actions available</Typography>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Projects;
