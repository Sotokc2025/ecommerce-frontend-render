// @ts-check
import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/templates/AdminLayout/AdminLayout';
import { http } from '../../services/http';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    http.get('/products')
      .then(res => setProducts(res.data?.products || res.data || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <h1>Gestión de Productos</h1>
      {loading ? <p>Cargando porductos...</p> : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr style={{ background: '#ecf0f1', textAlign: 'left' }}>
              <th style={{ padding: '10px' }}>ID</th>
              <th style={{ padding: '10px' }}>Nombre</th>
              <th style={{ padding: '10px' }}>Precio</th>
              <th style={{ padding: '10px' }}>Stock</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p._id} style={{ borderBottom: '1px solid #bdc3c7' }}>
                <td style={{ padding: '10px' }}>{p._id}</td>
                <td style={{ padding: '10px' }}>{p.name}</td>
                <td style={{ padding: '10px' }}>${p.price}</td>
                <td style={{ padding: '10px' }}>{p.stockCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </AdminLayout>
  );
}
