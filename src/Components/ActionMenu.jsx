import React, { useState } from 'react';
import './ActionMenu.css';
import { FaEye, FaEdit, FaShareAlt, FaArchive, FaHistory } from 'react-icons/fa';
import PDFPreviewModal from './PdfPreviewModal';
import axios from 'axios';

const ActionMenu = ({ onClose, onEdit, documentData,onArchive }) => {
  const [showPreview, setShowPreview] = useState(false);
  
  const handleEditClick = () => {
    if (onEdit && documentData) {
      onEdit(documentData);
    }
    // Close the menu after starting edit
    if (typeof onClose === 'function') {
      onClose();
    }
  };

  const handleArchiveClick = async () => {
  try {
    await axios.put(`http://localhost:5000/api/upload/archive/${documentData.id}`, {
      archived: true
    });
    
    // Inform parent component about successful archive
    if (onArchive && typeof onArchive === 'function') {
      onArchive(documentData.id);
    }
    safeClose();
  } catch (error) {
    console.error('Error archiving document:', error);
  }
};

  const handlePreviewClick = () => {
    setShowPreview(true);
  };

  const handleClosePreview = () => {
    setShowPreview(false);
  };

  // Function to safely call onClose
  const safeClose = () => {
    if (typeof onClose === 'function') {
      onClose();
    }
  };

  return (
    <>
      <div className="action-menu">
        <div className="action-row">
          <div 
            className="action-icon" 
            title="Preview"
            onClick={handlePreviewClick}
          >
            <FaEye />
          </div>
          <div 
            className="action-icon" 
            title="Edit"
            onClick={handleEditClick}
          >
            <FaEdit />
          </div>
          <div 
            className="action-icon" 
            title="Share"
            onClick={safeClose}
          >
            <FaShareAlt />
          </div>
        </div>
        <div className="action-row-second">
          <div 
          className="action-icon" 
          title="Archive"
          onClick={handleArchiveClick}
           >
            <FaArchive />
         </div>
          <div 
            className="action-icon" 
            title="Revision History"
            onClick={safeClose}
          >
            <FaHistory />
          </div>
        </div>
      </div>

      {/* PDF Preview Modal */}
      {showPreview && documentData && (
        <PDFPreviewModal 
          file={documentData.fileUrl || documentData.url} 
          filename={documentData.filename}
          onClose={handleClosePreview} 
        />
      )}
    </>
  );
};

// Add default props
ActionMenu.defaultProps = {
  onClose: () => {},
  onEdit: () => {},
  onArchive: () => {},
  documentData: null
};

export default ActionMenu;