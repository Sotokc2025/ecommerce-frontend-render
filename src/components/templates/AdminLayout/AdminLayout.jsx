import React from 'react';
import { NavLink } from 'react-router-dom';
import './AdminLayout.css';

const AdminLayout = ({ children }) => {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2>Panel Admin</h2>
        <nav>
          <ul>
            <li>
              <NavLink to="/admin" end className={({isActive}) => isActive ? "active" : ""}>
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/products" className={({isActive}) => isActive ? "active" : ""}>
                Productos
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/orders" className={({isActive}) => isActive ? "active" : ""}>
                Órdenes
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/users" className={({isActive}) => isActive ? "active" : ""}>
                Usuarios
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="admin-content">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
