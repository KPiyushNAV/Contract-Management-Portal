
import React from 'react';
import './ActionMenu.css';
import { FaEye, FaEdit, FaShareAlt, FaArchive, FaHistory } from 'react-icons/fa';

const ActionMenu = ({ onClose }) => {
  return (
    <div className="action-menu">
      <div className="action-row">
        <div className="action-icon" title="Preview"><FaEye /></div>
        <div className="action-icon" title="Edit"><FaEdit /></div>
        <div className="action-icon" title="Share"><FaShareAlt /></div>
      </div>
      <div className="action-row-second">
        <div className="action-icon" title="Archive"><FaArchive /></div>
        <div className="action-icon" title="Revision History"><FaHistory /></div>
      </div>
    </div>
  );
};

export default ActionMenu;
