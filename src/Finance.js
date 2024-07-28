import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import './index.css';

function Finance() {
  const [transactions, setTransactions] = useState([]);
  const [type, setType] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTransactions();
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

    setTransactions([...transactions, data[0]]);
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

    setTransactions(transactions.map(txn => (txn.id === editingTransaction.id ? data[0] : txn)));
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
    <div className="content">
      <h2 className="text-2xl font-bold mb-6">Finance Module</h2>
      {error && <div className="error text-red-500 mb-4">{error}</div>}
      <input
        type="text"
        className="border border-gray-300 p-2 mb-4 w-full"
        placeholder="Type"
        value={type}
        onChange={(e) => setType(e.target.value)}
      />
      <input
        type="number"
        className="border border-gray-300 p-2 mb-4 w-full"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <input
        type="date"
        className="border border-gray-300 p-2 mb-4 w-full"
        placeholder="Date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <input
        type="text"
        className="border border-gray-300 p-2 mb-4 w-full"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button onClick={editingTransaction ? updateTransaction : addTransaction} className="bg-blue-500 text-white p-2 rounded">
        {editingTransaction ? 'Update Transaction' : 'Add Transaction'}
      </button>
      <table className="table-auto w-full mt-6">
        <thead>
          <tr>
            <th className="px-4 py-2">Type</th>
            <th className="px-4 py-2">Amount</th>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Description</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(transaction => (
            <tr key={transaction.id} className="bg-gray-200">
              <td className="border px-4 py-2">{transaction.type}</td>
              <td className="border px-4 py-2">{transaction.amount}</td>
              <td className="border px-4 py-2">{transaction.date}</td>
              <td className="border px-4 py-2">{transaction.description}</td>
              <td className="border px-4 py-2">
                <button className="bg-green-500 text-white p-1 rounded mr-2" onClick={() => {
                  setType(transaction.type);
                  setAmount(transaction.amount);
                  setDate(transaction.date);
                  setDescription(transaction.description);
                  setEditingTransaction(transaction);
                }}>Edit</button>
                <button className="bg-red-500 text-white p-1 rounded" onClick={() => deleteTransaction(transaction.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Finance;
