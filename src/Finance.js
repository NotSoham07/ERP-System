import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { useAuth } from './AuthContext';
import { TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';

function Finance() {
  const { roles } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [type, setType] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTransactions();

    const subscription = supabase
      .channel('public:Transactions')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'Transactions' }, (payload) => {
        console.log('Change received!', payload);
        fetchTransactions();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const fetchTransactions = async () => {
    const { data, error } = await supabase.from('Transactions').select('*');
    if (error) {
      setError('Error fetching transactions');
      console.error(error.message);
    } else {
      setTransactions(data || []);
    }
  };

  const validateForm = () => {
    if (!type || !amount || !date || !description) {
      setError('All fields are required');
      return false;
    }
    setError(null);
    return true;
  };

  const addTransaction = async () => {
    if (!validateForm()) return;

    const { data, error } = await supabase.from('Transactions').insert([
      { type, amount, date, description }
    ]);

    if (error) {
      setError('Error adding transaction');
      console.error(error.message);
      return;
    }

    if (data && data.length > 0) {
      setTransactions([...transactions, data[0]]);
    } else {
      setError('No data returned from the server');
    }
    resetForm();
  };

  const updateTransaction = async () => {
    if (!validateForm()) return;

    const { data, error } = await supabase.from('Transactions').update({
      type, amount, date, description
    }).eq('id', editingTransaction.id);

    if (error) {
      setError('Error updating transaction');
      console.error(error.message);
      return;
    }

    if (data && data.length > 0) {
      setTransactions(transactions.map(txn => (txn.id === editingTransaction.id ? data[0] : txn)));
    } else {
      setError('No data returned from the server');
    }
    resetForm();
  };

  const deleteTransaction = async (id) => {
    const { error } = await supabase.from('Transactions').delete().eq('id', id);
    if (error) {
      setError('Error deleting transaction');
      console.error(error.message);
    } else {
      setTransactions(transactions.filter(txn => txn.id !== id));
    }
  };

  const resetForm = () => {
    setType('');
    setAmount('');
    setDate('');
    setDescription('');
    setEditingTransaction(null);
    setError(null);
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>Finance Module</Typography>
      {error && <Typography color="error" gutterBottom>{error}</Typography>}
      {(roles.includes('admin') || roles.includes('manager')) ? (
        <>
          <TextField
            label="Type"
            variant="outlined"
            fullWidth
            value={type}
            onChange={(e) => setType(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Amount"
            variant="outlined"
            fullWidth
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            margin="normal"
            type="number"
          />
          <TextField
            label="Date"
            variant="outlined"
            fullWidth
            value={date}
            onChange={(e) => setDate(e.target.value)}
            margin="normal"
            type="date"
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
            onClick={editingTransaction ? updateTransaction : addTransaction}
            sx={{ mt: 2 }}
          >
            {editingTransaction ? 'Update Transaction' : 'Add Transaction'}
          </Button>
        </>
      ) : (
        <Typography>You do not have permission to add or edit transactions.</Typography>
      )}
      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
        <TableHead>
  <TableRow>
    <TableCell>
      <Typography variant="body1" fontWeight="bold">
        Type
      </Typography>
    </TableCell>
    <TableCell>
      <Typography variant="body1" fontWeight="bold">
        Amount
      </Typography>
    </TableCell>
    <TableCell>
      <Typography variant="body1" fontWeight="bold">
        Date
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

          <TableBody>
            {transactions.map(transaction => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.type}</TableCell>
                <TableCell>{transaction.amount}</TableCell>
                <TableCell>{transaction.date}</TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>
                  {(roles.includes('admin') || roles.includes('manager')) ? (
                    <>
                      <Button
                        variant="outlined"
                        color="success"
                        onClick={() => {
                          setType(transaction.type);
                          setAmount(transaction.amount);
                          setDate(transaction.date);
                          setDescription(transaction.description);
                          setEditingTransaction(transaction);
                        }}
                        sx={{ mr: 1 }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => deleteTransaction(transaction.id)}
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

export default Finance;
