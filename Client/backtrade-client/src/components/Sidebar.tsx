import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaChartLine, FaCogs, FaPlay, FaSignOutAlt } from 'react-icons/fa';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    navigate('/Login');
  }

  return (
    <div className="Sidebar-container">
      <Link to="/main/dashboard" className="Sidebar-logo">
        <img className="Sidebar-logo-image" src={require('../assets/logo.png')} />
      </Link>
      <div className="Sidebar-header">Quick Access</div>
      <Link to="/main/dashboard" className="Sidebar-item">
        <FaChartLine /> Dashboard
      </Link>
      <Link to="/main/simulator" className="Sidebar-item">
        <FaPlay /> Simulator
      </Link>
      <Link to="/main/configuration" className="Sidebar-item">
        <FaCogs /> Configuration
      </Link>
      <div className="Sidebar-item" onClick={handleLogoutClick}>
        <FaSignOutAlt /> Log Out
      </div>
    </div>
  );
}

export default Sidebar;
