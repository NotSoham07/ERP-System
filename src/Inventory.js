import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { useAuth } from './AuthContext';
import { TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';

function Inventory() {
  const { roles } = useAuth();
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [supplier, setSupplier] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchItems();

    const subscription = supabase
      .channel('public:Inventory')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'Inventory' }, (payload) => {
        console.log('Change received!', payload);
        fetchItems();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const fetchItems = async () => {
    const { data, error } = await supabase.from('Inventory').select('*');
    if (error) {
      setError('Error fetching items');
      console.error(error.message);
    } else {
      setItems(data || []);
    }
  };

  const validateForm = () => {
    if (!name || !quantity || !price || !supplier) {
      setError('All fields are required');
      return false;
    }
    setError(null);
    return true;
  };

  const addItem = async () => {
    if (!validateForm()) return;

    const { data, error } = await supabase.from('Inventory').insert([
      { name, quantity, price, supplier }
    ]);

    if (error) {
      setError('Error adding item');
      console.error(error.message);
      return;
    }

    if (data && data.length > 0) {
      setItems([...items, data[0]]);
    } else {
      setError('No data returned from the server');
    }
    resetForm();
  };

  const updateItem = async () => {
    if (!validateForm()) return;

    const { data, error } = await supabase.from('Inventory').update({
      name, quantity, price, supplier
    }).eq('id', editingItem.id);

    if (error) {
      setError('Error updating item');
      console.error(error.message);
      return;
    }

    if (data && data.length > 0) {
      setItems(items.map(item => (item.id === editingItem.id ? data[0] : item)));
    } else {
      setError('No data returned from the server');
    }
    resetForm();
  };

  const deleteItem = async (id) => {
    const { error } = await supabase.from('Inventory').delete().eq('id', id);
    if (error) {
      setError('Error deleting item');
      console.error(error.message);
    } else {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const resetForm = () => {
    setName('');
    setQuantity('');
    setPrice('');
    setSupplier('');
    setEditingItem(null);
    setError(null);
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>Inventory Module</Typography>
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
            label="Quantity"
            variant="outlined"
            fullWidth
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            margin="normal"
            type="number"
          />
          <TextField
            label="Price"
            variant="outlined"
            fullWidth
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            margin="normal"
            type="number"
          />
          <TextField
            label="Supplier"
            variant="outlined"
            fullWidth
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={editingItem ? updateItem : addItem}
            sx={{ mt: 2 }}
          >
            {editingItem ? 'Update Item' : 'Add Item'}
          </Button>
        </>
      ) : (
        <Typography>You do not have permission to add or edit items.</Typography>
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
        Quantity
      </Typography>
    </TableCell>
    <TableCell>
      <Typography variant="body1" fontWeight="bold">
        Price
      </Typography>
    </TableCell>
    <TableCell>
      <Typography variant="body1" fontWeight="bold">
        Supplier
      </Typography>
    </TableCell>
    <TableCell>
      <Typography variant="body1" fontWeight="bold">
        Actions
      </Typography>
    </TableCell>
  </TableRow>
</TableHead>


          
          <TableBody>
            {items.map(item => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.price}</TableCell>
                <TableCell>{item.supplier}</TableCell>
                <TableCell>
                  {(roles.includes('admin') || roles.includes('manager')) ? (
                    <>
                      <Button
                        variant="outlined"
                        color="success"
                        onClick={() => {
                          setName(item.name);
                          setQuantity(item.quantity);
                          setPrice(item.price);
                          setSupplier(item.supplier);
                          setEditingItem(item);
                        }}
                        sx={{ mr: 1 }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => deleteItem(item.id)}
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

export default Inventory;
