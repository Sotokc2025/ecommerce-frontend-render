// @ts-check
import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/templates/AdminLayout/AdminLayout';
import { http } from '../../services/http';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    http.get('/users')
      .then(res => setUsers(res.data?.users || res.data || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <h1>Gestión de Usuarios</h1>
      {loading ? <p>Cargando usuarios...</p> : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr style={{ background: '#ecf0f1', textAlign: 'left' }}>
              <th style={{ padding: '10px' }}>ID</th>
              <th style={{ padding: '10px' }}>Email</th>
              <th style={{ padding: '10px' }}>Rol</th>
              <th style={{ padding: '10px' }}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id} style={{ borderBottom: '1px solid #bdc3c7' }}>
                <td style={{ padding: '10px' }}>{u._id}</td>
                <td style={{ padding: '10px' }}>{u.email}</td>
                <td style={{ padding: '10px' }}>{u.role}</td>
                <td style={{ padding: '10px' }}>{u.isActive ? "Activo" : "Inactivo"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </AdminLayout>
  );
}
