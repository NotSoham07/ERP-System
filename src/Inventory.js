import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

function Inventory() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [supplier, setSupplier] = useState('');
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const { data, error } = await supabase.from('Inventory').select('*');
    if (error) {
      console.error('Error fetching items:', error.message);
    } else {
      setItems(data || []);
    }
  };

  const addItem = async () => {
    console.log('Adding item:', { name, quantity, price, supplier });
    const { data, error } = await supabase.from('Inventory').insert([
      { name, quantity, price, supplier }
    ]);

    if (error) {
      console.error('Error adding item:', error.message);
      return;
    }

    if (data && data.length > 0) {
      console.log('Item added:', data);
      setItems([...items, data[0]]);
      resetForm();
    } else {
      console.error('No data returned from insert operation');
    }
  };

  const updateItem = async () => {
    const { data, error } = await supabase.from('Inventory').update({
      name, quantity, price, supplier
    }).eq('id', editingItem.id);
    
    if (error) {
      console.error('Error updating item:', error.message);
      return;
    }

    if (data && data.length > 0) {
      setItems(items.map(item => (item.id === editingItem.id ? data[0] : item)));
      resetForm();
    } else {
      console.error('No data returned from update operation');
    }
  };

  const deleteItem = async (id) => {
    const { error } = await supabase.from('Inventory').delete().eq('id', id);
    if (error) {
      console.error('Error deleting item:', error.message);
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
  };

  return (
    <div>
      <h2>Inventory Module</h2>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <input
        type="text"
        placeholder="Supplier"
        value={supplier}
        onChange={(e) => setSupplier(e.target.value)}
      />
      <button onClick={editingItem ? updateItem : addItem}>
        {editingItem ? 'Update Item' : 'Add Item'}
      </button>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            {item.name}: {item.quantity}
            <button onClick={() => {
              setName(item.name);
              setQuantity(item.quantity);
              setPrice(item.price);
              setSupplier(item.supplier);
              setEditingItem(item);
            }}>Edit</button>
            <button onClick={() => deleteItem(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Inventory;
