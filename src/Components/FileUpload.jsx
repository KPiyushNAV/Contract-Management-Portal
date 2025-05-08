import { useState, useEffect } from 'react';
import axios from 'axios';
import './FileUpload.css';
import MetadataModal from './MetadataModal';
import ActionMenu from './ActionMenu'; 
import { useRef } from 'react';
import { BsThreeDotsVertical, BsPlusLg } from 'react-icons/bs';
import moment from 'moment';

function FileUpload() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [documentsExpanded, setDocumentsExpanded] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filesToUpload, setFilesToUpload] = useState([]);
  const [currentFolder, setCurrentFolder] = useState('All Documents');
  const [expandedDescIndex, setExpandedDescIndex] = useState(null);
  const [showDescriptionPopup, setShowDescriptionPopup] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [showMenuIndex, setShowMenuIndex] = useState(null);
  const actionMenuRef = useRef(null);

  useEffect(() => {
    fetchUploadedFiles();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target)) {
        setShowMenuIndex(null);
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
  
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  

  const fetchUploadedFiles = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/upload/files');
      const filesWithDetails = response.data.map(file => ({
        ...file,
        selected: false,
        fileSize: formatFileSize(file.size || 0),
        uploadedDate: file.uploaded_at ? moment(file.uploaded_at).format('MM/DD/YYYY') : moment().format('MM/DD/YYYY'),
        type: file.folder || 'Unknown'
      }));
      setUploadedFiles(filesWithDetails);
    } catch (err) {
      console.error('Error fetching files:', err);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
    else return (bytes / 1048576).toFixed(2) + ' MB';
  };

  // Removed the handleFileChange function as it's now handled in MetadataModal

  const handleMetadataSubmit = async (metadataList, files) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });
    formData.append("metadata", JSON.stringify(metadataList));

    setShowModal(false);
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/upload", formData);
      const newFiles = res.data.files.map((file) => ({
        ...file,
        selected: false,
        fileSize: formatFileSize(file.size || 0),
        uploadedDate: moment().format('MM/DD/YYYY'),
        type: file.folder || 'Unknown',
        filename: file.filename,
        description: file.description || "-",
        expiration_date: file.expiration_date || "-",
        owned_by: file.owned_by || "-",
        start_date: file.start_date || "-",
        folder: file.folder || "-"
      }));

      setUploadedFiles([...uploadedFiles, ...newFiles]);
      setToast({ show: true, message: "Files uploaded successfully", type: "success" });
      setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
    } catch (err) {
      console.error("Upload failed", err);
      setToast({ show: true, message: "Upload failed. Missing Information", type: "error" });
      setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (index) => {
    const updatedFiles = uploadedFiles.map((file, idx) =>
      idx === index ? { ...file, selected: !file.selected } : file
    );
    setUploadedFiles(updatedFiles);
    setSelectedFiles(updatedFiles.filter(file => file.selected));
  };

  const handleFolderChange = (folder) => {
    setCurrentFolder(folder);
  };

  const handleCancelUpload = () => {
    setShowModal(false);
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleDescriptionClick = (desc, idx) => {
    setShowDescriptionPopup(idx !== showDescriptionPopup ? idx : null);
  };

  const getFolderCounts = () => {
    const counts = {
      total: uploadedFiles.length,
      Agreements: 0,
      MoUs: 0,
      Contracts: 0
    };

    uploadedFiles.forEach(file => {
      if (file.folder === 'Agreements') counts.Agreements++;
      else if (file.folder === 'MoUs') counts.MoUs++;
      else if (file.folder === 'Contracts') counts.Contracts++;
    });

    return counts;
  };

  const folderCounts = getFolderCounts();

  
  const filteredFiles = currentFolder === 'All Documents' 
    ? uploadedFiles 
    : uploadedFiles.filter(file => file.folder === currentFolder);

  const truncateDescription = (desc, idx) => {
    const limit = 50;
    if (showDescriptionPopup === idx || desc.length <= limit) {
      return desc;
    }
    return desc.slice(0, limit) + '...';
  };

  return (
    <div className="document-manager">
      <div className="document-content">
        <div className="sidebar">
          <div className="folders-header">Folders</div>
          <ul className="folder-list">
            <li 
              className={`parent-folder ${currentFolder === 'All Documents' ? 'active' : ''}`}
              onClick={() => {
                setCurrentFolder('All Documents');
                setDocumentsExpanded(!documentsExpanded);
              }}
            >
              <span className="folder-icon">📂</span> Documents
              <span className="file-count">{folderCounts.total}</span>
            </li>
            {documentsExpanded && (
              <>
                <li className={currentFolder === 'Agreements' ? 'active' : ''}
                    onClick={() => handleFolderChange('Agreements')}>
                  <span className="subfolder-icon">📁</span> Agreements
                  <span className="file-count">{folderCounts.Agreements}</span>
                </li>
                <li className={currentFolder === 'MoUs' ? 'active' : ''}
                    onClick={() => handleFolderChange('MoUs')}>
                  <span className="subfolder-icon">📁</span> MoUs
                  <span className="file-count">{folderCounts.MoUs}</span>
                </li>
                <li className={currentFolder === 'Contracts' ? 'active' : ''}
                    onClick={() => handleFolderChange('Contracts')}>
                  <span className="subfolder-icon">📁</span> Contracts
                  <span className="file-count">{folderCounts.Contracts}</span>
                </li>
              </>
            )}
          </ul>
        </div>

        <div className="document-main">
          <div className="document-toolbar">
            <div className="folder-path">
              <span>Documents</span>
              {currentFolder !== 'All Documents' && <span> &gt; {currentFolder}</span>}
            </div>
            <div className="toolbar-buttons">
              {/* Replace button with plus icon */}
              <button className="icon-btn upload-btn" onClick={handleOpenModal}>
                <BsPlusLg size={18} />
              </button>
              <button className="new-folder-btn">
                Archived Folder
              </button>
            </div>
          </div>

          <div className="document-table">
            <div className="document-table-header">
              <div className="serial-no-cell header-cell">S.No.</div>
              
              <div className="type-cell header-cell">Type</div>
              <div className="name-cell header-cell">Title</div>
              <div className='desc-cell header-cell'>Description</div>
              <div className="ownedby-cell header-cell">Owner</div>
              <div className="maintainedby-cell header-cell">Maintainer</div>
              <div className="data-size-cell header-cell">Valid From</div>
              <div className="ending-cell header-cell">Valid Till</div>
              <div className="uploaded-date-cell header-cell">Uploaded On</div>
              <div className="actions-cell header-cell">Actions</div>
            </div>

            <div className="document-table-body">
              {filteredFiles.length > 0 ? (
                filteredFiles.map((file, idx) => (
                  <div className="document-row" key={idx}>
                    <div className="serial-no-cell-content">{idx + 1}</div>
                    
                    <div className="type-cell">{file.type}</div>
                    <div className="name-cell">{file.filename}</div>
                    <div className="desc-cell" onClick={() => handleDescriptionClick(file.description, idx)}>
                      <div className="desc-content">
                        {truncateDescription(file.description || '-', idx)}
                        {file.description && file.description.length > 50 && 
                          <span className="read-more">Read more</span>
                        }
                      </div>
                      {showDescriptionPopup === idx && (
                        <div className="description-popup">
                          <div className="popup-header">
                            <h4>Full Description</h4>
                            <button onClick={(e) => {
                              e.stopPropagation();
                              setShowDescriptionPopup(null);
                            }}>✖</button>
                          </div>
                          <div className="popup-content">
                            {file.description || '-'}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="ownedby-cell">{file.owned_by || '-'}</div>
                    <div className="maintainedby-cell">{file.maintained_by || '-'}</div>
                    <div className="data-size-cell">
                      {file.start_date ? moment(file.start_date).format('DD/MM/YYYY') : '-'}
                    </div>
                    <div className="ending-cell">
                      {file.expiration_date ? moment(file.expiration_date).format('DD/MM/YYYY') : '-'}
                    </div>

                    <div className="uploaded-date-cell">{file.uploadedDate}</div>
                    <div className="actions-cell" style={{ position: 'relative' }} ref={showMenuIndex === idx ? actionMenuRef : null}>
                    <BsThreeDotsVertical className="action-btn" style={{ cursor: 'pointer' }} onClick={() => setShowMenuIndex(showMenuIndex === idx ? null : idx)} />
                    {showMenuIndex === idx && (
                     <div className="action-menu-popup">
                     <ActionMenu />
                      </div>
                    )}
                   </div>
                  </div>
                ))
              ) : (
                <div className="no-documents">
                  <p>No documents found. Click the + icon to upload documents.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <MetadataModal
          onSubmit={handleMetadataSubmit}
          onCancel={handleCancelUpload}
        />
      )}
      
      {toast.show && (
        <div className="toast-container">
          <div className={`toast ${toast.type}`}>
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
}

export default FileUpload;