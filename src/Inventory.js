import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import './index.css';

function Inventory() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [supplier, setSupplier] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchItems();
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

    setItems([...items, data[0]]);
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

    setItems(items.map(item => (item.id === editingItem.id ? data[0] : item)));
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
    <div className="content">
      <h2 className="text-2xl font-bold mb-6">Inventory Module</h2>
      {error && <div className="error text-red-500 mb-4">{error}</div>}
      <input
        type="text"
        className="border border-gray-300 p-2 mb-4 w-full"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="number"
        className="border border-gray-300 p-2 mb-4 w-full"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />
      <input
        type="number"
        className="border border-gray-300 p-2 mb-4 w-full"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <input
        type="text"
        className="border border-gray-300 p-2 mb-4 w-full"
        placeholder="Supplier"
        value={supplier}
        onChange={(e) => setSupplier(e.target.value)}
      />
      <button onClick={editingItem ? updateItem : addItem} className="bg-blue-500 text-white p-2 rounded">
        {editingItem ? 'Update Item' : 'Add Item'}
      </button>
      <table className="table-auto w-full mt-6">
        <thead>
          <tr>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Quantity</th>
            <th className="px-4 py-2">Price</th>
            <th className="px-4 py-2">Supplier</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id} className="bg-gray-200">
              <td className="border px-4 py-2">{item.name}</td>
              <td className="border px-4 py-2">{item.quantity}</td>
              <td className="border px-4 py-2">{item.price}</td>
              <td className="border px-4 py-2">{item.supplier}</td>
              <td className="border px-4 py-2">
                <button className="bg-green-500 text-white p-1 rounded mr-2" onClick={() => {
                  setName(item.name);
                  setQuantity(item.quantity);
                  setPrice(item.price);
                  setSupplier(item.supplier);
                  setEditingItem(item);
                }}>Edit</button>
                <button className="bg-red-500 text-white p-1 rounded" onClick={() => deleteItem(item.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Inventory;
