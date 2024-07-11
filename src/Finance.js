import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

function Finance() {
  const [transactions, setTransactions] = useState([]);
  const [type, setType] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [editingTransaction, setEditingTransaction] = useState(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    const { data, error } = await supabase.from('Transactions').select('*');
    if (error) {
      console.error('Error fetching transactions:', error.message);
    } else {
      setTransactions(data);
    }
  };

  const addTransaction = async () => {
    const { data, error } = await supabase.from('Transactions').insert([
      { type, amount, date, description }
    ]);
    if (error) {
      console.error('Error adding transaction:', error.message);
    } else {
      setTransactions([...transactions, data[0]]);
      resetForm();
    }
  };

  const updateTransaction = async () => {
    const { data, error } = await supabase.from('Transactions').update({
      type, amount, date, description
    }).eq('id', editingTransaction.id);
    if (error) {
      console.error('Error updating transaction:', error.message);
    } else {
      setTransactions(transactions.map(txn => (txn.id === editingTransaction.id ? data[0] : txn)));
      resetForm();
    }
  };

  const deleteTransaction = async (id) => {
    const { error } = await supabase.from('Transactions').delete().eq('id', id);
    if (error) {
      console.error('Error deleting transaction:', error.message);
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
  };

  return (
    <div>
      <h2>Finance Module</h2>
      <input
        type="text"
        placeholder="Type"
        value={type}
        onChange={(e) => setType(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <input
        type="date"
        placeholder="Date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button onClick={editingTransaction ? updateTransaction : addTransaction}>
        {editingTransaction ? 'Update Transaction' : 'Add Transaction'}
      </button>
      <ul>
        {transactions.map(transaction => (
          <li key={transaction.id}>
            {transaction.type}: ${transaction.amount}
            <button onClick={() => {
              setType(transaction.type);
              setAmount(transaction.amount);
              setDate(transaction.date);
              setDescription(transaction.description);
              setEditingTransaction(transaction);
            }}>Edit</button>
            <button onClick={() => deleteTransaction(transaction.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Finance;
