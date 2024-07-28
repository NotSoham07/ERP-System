import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (session?.user) {
        const { data: rolesData, error } = await supabase
          .from('user_roles')
          .select('roles(name)')
          .eq('user_id', session.user.id);
        if (error) {
          console.error('Error fetching roles:', error.message);
        } else {
          setRoles(rolesData.map(role => role.roles.name));
        }
      }
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          const fetchRoles = async () => {
            const { data: rolesData, error } = await supabase
              .from('user_roles')
              .select('roles(name)')
              .eq('user_id', session.user.id);
            if (error) {
              console.error('Error fetching roles:', error.message);
            } else {
              setRoles(rolesData.map(role => role.roles.name));
            }
          };
          fetchRoles();
        } else {
          setRoles([]);
        }
      }
    );

    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      throw new Error(error.message);
    }
    setUser(data.user);
  };

  const signup = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      throw new Error(error.message);
    }
    setUser(data.user);
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
    setUser(null);
    setRoles([]);
  };

  return (
    <AuthContext.Provider value={{ user, roles, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
