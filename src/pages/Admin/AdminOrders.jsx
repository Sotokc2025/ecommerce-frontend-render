import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/templates/AdminLayout/AdminLayout';
import { http } from '../../services/http';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    http.get('/orders')
      .then(res => setOrders(res.data?.orders || res.data || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <h1>Gestión de Órdenes</h1>
      {loading ? <p>Cargando órdenes...</p> : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr style={{ background: '#ecf0f1', textAlign: 'left' }}>
              <th style={{ padding: '10px' }}>ID Orden</th>
              <th style={{ padding: '10px' }}>Usuario</th>
              <th style={{ padding: '10px' }}>Total</th>
              <th style={{ padding: '10px' }}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o._id} style={{ borderBottom: '1px solid #bdc3c7' }}>
                <td style={{ padding: '10px' }}>{o._id}</td>
                <td style={{ padding: '10px' }}>{o.user?.email || o.user}</td>
                <td style={{ padding: '10px' }}>${o.totalPrice}</td>
                <td style={{ padding: '10px' }}>{o.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </AdminLayout>
  );
}
