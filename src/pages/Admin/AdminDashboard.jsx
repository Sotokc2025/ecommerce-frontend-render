import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/templates/AdminLayout/AdminLayout';
import { http } from '../../services/http';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, products: 0, orders: 0 });

  useEffect(() => {
    // In a real app we'd fetch a dedicated /admin/stats endpoint
    // For now we'll just mock or fetch lists to get lengths
    Promise.all([
      http.get('/users?limit=1'),
      http.get('/products?limit=1'),
      http.get('/orders?limit=1')
    ]).then(([u, p, o]) => {
      setStats({
        users: u.data?.total || 0,
        products: p.data?.total || p.data?.count || 0,
        orders: o.data?.total || o.data?.count || 0,
      });
    }).catch(err => console.error("Error fetching stats", err));
  }, []);

  return (
    <AdminLayout>
      <h1>Dashboard Admin</h1>
      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        <div style={{ padding: '20px', background: '#3498db', color: '#fff', borderRadius: '8px', minWidth: '150px' }}>
          <h3>Usuarios</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.users}</p>
        </div>
        <div style={{ padding: '20px', background: '#2ecc71', color: '#fff', borderRadius: '8px', minWidth: '150px' }}>
          <h3>Productos</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.products}</p>
        </div>
        <div style={{ padding: '20px', background: '#e74c3c', color: '#fff', borderRadius: '8px', minWidth: '150px' }}>
          <h3>Órdenes</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.orders}</p>
        </div>
      </div>
    </AdminLayout>
  );
}
