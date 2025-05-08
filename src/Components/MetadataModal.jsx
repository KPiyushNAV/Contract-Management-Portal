import React, { useState, useRef, useEffect } from 'react';
import './MetadataModal.css';
import { BsUpload } from 'react-icons/bs';

export default function MetadataModal({ onSubmit, onCancel }) {
  const [files, setFiles] = useState([]);
  const [metadataList, setMetadataList] = useState([]);
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const fileInputRef = useRef(null);
  const [toasts, setToasts] = useState([]);

  const MAX_DESCRIPTION_LENGTH = 500;

  // Function to add a toast message
  const showToast = (message, type = 'error', duration = 3000) => {
    const id = Date.now();
    setToasts(prevToasts => [...prevToasts, { id, message, type, duration }]);
    return id;
  };

  // Function to remove a toast by ID
  const removeToast = (id) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  };

  // Handle file selection
  const handleFileSelect = (selectedFiles) => {
    const fileArray = Array.from(selectedFiles);
    setFiles([...files, ...fileArray]);

    // Initialize metadata for new files
    const newMetadata = fileArray.map(file => ({
      folder: 'Agreements',
      description: '',
      owned_by: '',
      maintained_by: '',
      start_date: '',
      expiration_date: '',
      name: file.name || `File ${files.length + fileArray.indexOf(file) + 1}`,
    }));

    setMetadataList([...metadataList, ...newMetadata]);
  };

  // Handle file input change
  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files);
    }
  };

  // Handle metadata changes
  const handleChange = (index, field, value) => {
    const updated = [...metadataList];
    updated[index] = { ...updated[index], [field]: value };
    setMetadataList(updated);
    
    // Clear validation error for this field when user starts typing
    if (validationErrors[index]?.[field]) {
      const updatedErrors = {...validationErrors};
      if (updatedErrors[index]) {
        delete updatedErrors[index][field];
        if (Object.keys(updatedErrors[index]).length === 0) {
          delete updatedErrors[index];
        }
      }
      setValidationErrors(updatedErrors);
    }
  };

  // Validate all required fields
  const validateMetadata = (index) => {
    const metadata = metadataList[index];
    const errors = {};
    
    // Check required fields
    if (!metadata.folder || metadata.folder.trim() === '') {
      errors.folder = 'Folder is required';
    }
    if (!metadata.description || metadata.description.trim() === '') {
      errors.description = 'Description is required';
    }
    if (!metadata.owned_by || metadata.owned_by.trim() === '') {
      errors.owned_by = 'Owner is required';
    }
    if (!metadata.maintained_by || metadata.maintained_by.trim() === '') {
      errors.maintained_by = 'Maintainer is required';
    }
    if (!metadata.start_date || metadata.start_date.trim() === '') {
      errors.start_date = 'Valid From date is required';
    }
    if (!metadata.expiration_date || metadata.expiration_date.trim() === '') {
      errors.expiration_date = 'Valid Till date is required';
    }
    
    return errors;
  };

  // Handle file submission with validation
  const handleSubmit = () => {
    if (files.length === 0) {
      // Show toast for missing files
      showToast('Please select at least one file to upload', 'error');
      return;
    }

    // Validate all files' metadata
    const allErrors = {};
    let hasErrors = false;
    
    for (let i = 0; i < metadataList.length; i++) {
      const fileErrors = validateMetadata(i);
      if (Object.keys(fileErrors).length > 0) {
        allErrors[i] = fileErrors;
        hasErrors = true;
      }
    }

    if (hasErrors) {
      setValidationErrors(allErrors);
      setActiveFileIndex(parseInt(Object.keys(allErrors)[0]));
      // Show toast for missing fields
      showToast('Upload failed. Please fill in all required fields.', 'error');
      return;
    }

    setIsUploading(true);
    onSubmit(metadataList, files);
  };

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // Handle drop event
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  // Handle click on file upload area
  const handleFileUploadClick = () => {
    fileInputRef.current.click();
  };

  // Handle file removal
  const handleRemoveFile = (index) => {
    const newFiles = [...files];
    const newMetadata = [...metadataList];
    const newErrors = {...validationErrors};

    newFiles.splice(index, 1);
    newMetadata.splice(index, 1);
    
    // Update validation errors
    if (newErrors[index]) {
      delete newErrors[index];
    }
    
    // Adjust error indexes
    const adjustedErrors = {};
    Object.keys(newErrors).forEach(idx => {
      const numIdx = parseInt(idx);
      if (numIdx > index) {
        adjustedErrors[numIdx - 1] = newErrors[idx];
      } else {
        adjustedErrors[idx] = newErrors[idx];
      }
    });

    setFiles(newFiles);
    setMetadataList(newMetadata);
    setValidationErrors(adjustedErrors);

    if (activeFileIndex >= newFiles.length && newFiles.length > 0) {
      setActiveFileIndex(newFiles.length - 1);
    }
  };

  // Check if the current field has an error
  const hasError = (field) => {
    return validationErrors[activeFileIndex]?.[field] ? true : false;
  };

  // Get error message for a field
  const getErrorMessage = (field) => {
    return validationErrors[activeFileIndex]?.[field] || '';
  };

  // Calculate description characters left
  const descriptionLength = files.length > 0 ? metadataList[activeFileIndex]?.description?.length || 0 : 0;
  const charactersLeft = MAX_DESCRIPTION_LENGTH - descriptionLength;

  // Custom Toast Component
  const Toast = ({ id, message, type, duration }) => {
    useEffect(() => {
      const timer = setTimeout(() => {
        removeToast(id);
      }, duration);
      
      return () => clearTimeout(timer);
    }, [id, duration]);
    
    return (
      <div className={`toast-notification ${type}`}>
        <div className="toast-content">
          <div className="toast-message">{message}</div>
          <button className="toast-close" onClick={() => removeToast(id)}>✖</button>
        </div>
      </div>
    );
  };

  // If no files, show upload interface
  if (files.length === 0) {
    return (
      <div className="metadata-modal-overlay">
        <div className="metadata-modal">
          <div className="modal-header">
            <h2>Upload Documents</h2>
            <button className="close-btn" onClick={onCancel}>✖</button>
          </div>

          <div 
            className={`file-upload-area ${dragActive ? 'drag-active' : ''}`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={handleFileUploadClick}
          >
            <input 
              ref={fileInputRef}
              type="file" 
              multiple 
              className="file-input-hidden"
              onChange={handleFileInputChange}
              style={{ display: 'none' }}
            />
            <BsUpload size={48} className="upload-icon" />
            <p>Drag and drop files here or click to select files</p>
            <button className="browse-btn">Browse Files</button>
          </div>
          
          <div className="button-row">
            <button className="cancel-btn" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </div>
        
        {/* Toast Container */}
        <div className="toast-container">
          {toasts.map(toast => (
            <Toast
              key={toast.id}
              id={toast.id}
              message={toast.message}
              type={toast.type}
              duration={toast.duration}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="metadata-modal-overlay">
      <div className="metadata-modal">
        <div className="modal-header">
          <h2>Document Details</h2>
          <h6>(All fields are mandatory)</h6>
          
        </div>

        {files.length > 1 && (
          <div className="file-tabs">
            {files.map((file, idx) => (
              <div key={idx} className="file-tab-wrapper">
                <button 
                  className={`file-tab ${idx === activeFileIndex ? 'active-tab' : ''} ${validationErrors[idx] ? 'error-tab' : ''}`}
                  onClick={() => setActiveFileIndex(idx)}
                >
                  {file.name || `File ${idx + 1}`}
                </button>
                <button 
                  className="remove-file-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile(idx);
                  }}
                >
                  ✖
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="metadata-form">
          <div className="file-header">
            <div className="file-icon">
              {getFileIcon(files[activeFileIndex]?.name || '')}
            </div>
            <h3>{files[activeFileIndex]?.name || `File ${activeFileIndex + 1}`}</h3>
            {files.length === 1 && (
              <button 
                className="remove-file-btn"
                onClick={() => handleRemoveFile(activeFileIndex)}
              >
                ✖
              </button>
            )}
          </div>

          <div className="form-grid">
            <div className={`form-group ${hasError('folder') ? 'has-error' : ''}`}>
              <label>Folder<span className="required">*</span></label>
              <select
                value={metadataList[activeFileIndex]?.folder || 'Agreements'}
                onChange={(e) => handleChange(activeFileIndex, 'folder', e.target.value)}
                className={hasError('folder') ? 'error-input' : ''}
              >
                <option value="">Select a folder</option>
                <option value="Agreements">Agreements</option>
                <option value="MoUs">MoUs</option>
                <option value="Contracts">Contracts</option>
              </select>
              {hasError('folder') && <div className="error-message">{getErrorMessage('folder')}</div>}
            </div>

            <div className={`form-group ${hasError('owned_by') ? 'has-error' : ''}`}>
              <label>Owner<span className="required">*</span></label>
              <input
                type="text"
                value={metadataList[activeFileIndex]?.owned_by || ''}
                onChange={(e) => handleChange(activeFileIndex, 'owned_by', e.target.value)}
                placeholder="Enter owner name"
                className={hasError('owned_by') ? 'error-input' : ''}
              />
              {hasError('owned_by') && <div className="error-message">{getErrorMessage('owned_by')}</div>}
            </div>
            
            <div className={`form-group ${hasError('maintained_by') ? 'has-error' : ''}`}>
              <label>Maintainer<span className="required">*</span></label>
              <input
                type="text"
                value={metadataList[activeFileIndex]?.maintained_by || ''}
                onChange={(e) => handleChange(activeFileIndex, 'maintained_by', e.target.value)}
                placeholder="Enter maintainer name"
                className={hasError('maintained_by') ? 'error-input' : ''}
              />
              {hasError('maintained_by') && <div className="error-message">{getErrorMessage('maintained_by')}</div>}
            </div>

            <div className={`form-group ${hasError('start_date') ? 'has-error' : ''}`}>
              <label>Valid From<span className="required">*</span></label>
              <input
                type="date"
                value={metadataList[activeFileIndex]?.start_date || ''}
                onChange={(e) => handleChange(activeFileIndex, 'start_date', e.target.value)}
                className={hasError('start_date') ? 'error-input' : ''}
              />
              {hasError('start_date') && <div className="error-message">{getErrorMessage('start_date')}</div>}
            </div>

            <div className={`form-group ${hasError('expiration_date') ? 'has-error' : ''}`}>
              <label>Valid Till<span className="required">*</span></label>
              <input
                type="date"
                value={metadataList[activeFileIndex]?.expiration_date || ''}
                onChange={(e) => handleChange(activeFileIndex, 'expiration_date', e.target.value)}
                className={hasError('expiration_date') ? 'error-input' : ''}
              />
              {hasError('expiration_date') && <div className="error-message">{getErrorMessage('expiration_date')}</div>}
            </div>
          </div>

          <div className={`form-group full-width ${hasError('description') ? 'has-error' : ''}`}>
            <div className="description-label-wrapper">
              <label>Description<span className="required">*</span></label>
              <span className={`characters-left ${charactersLeft < 50 ? 'warning' : ''}`}>
                {charactersLeft} characters left
              </span>
            </div>
            <div className="description-container">
              <textarea
                value={metadataList[activeFileIndex]?.description || ''}
                onChange={(e) => {
                  if (e.target.value.length <= MAX_DESCRIPTION_LENGTH) {
                    handleChange(activeFileIndex, 'description', e.target.value);
                  }
                }}
                placeholder="Enter document description"
                maxLength={MAX_DESCRIPTION_LENGTH}
                className={`description-textarea ${hasError('description') ? 'error-input' : ''}`}
                rows={5}
              />
              {hasError('description') && <div className="error-message">{getErrorMessage('description')}</div>}
              {metadataList[activeFileIndex]?.description?.length > 0 && (
                <button 
                  type="button"
                  className="expand-description-btn"
                  onClick={() => setDescriptionExpanded(!descriptionExpanded)}
                >
                  {descriptionExpanded ? 'Hide Preview' : 'Show Preview'}
                </button>
              )}
            </div>
            {descriptionExpanded && metadataList[activeFileIndex]?.description?.length > 0 && (
              <div className="description-preview">
                <div className="description-content">
                  {metadataList[activeFileIndex].description}
                </div>
                <div className="preview-note"></div>
              </div>
            )}
          </div>
        </div>

        <div className="button-row">
          <button className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
          <button 
            className="add-more-btn"
            onClick={() => fileInputRef.current.click()}
          >
            Add More Files
          </button>
          {files.length > 1 && activeFileIndex < files.length - 1 ? (
            <button 
              className="next-btn"
              onClick={() => setActiveFileIndex(activeFileIndex + 1)}
            >
              Next
            </button>
          ) : (
            <button 
              className="submit-btn" 
              onClick={handleSubmit}
              disabled={isUploading}
            >
              {isUploading ? 'Uploading...' : 'Upload'}
            </button>
          )}
        </div>
      </div>
      
      {/* Toast Container */}
      <div className="toast-container">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            id={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
          />
        ))}
      </div>
      
      {/* Hidden file input for "Add More Files" button */}
      <input 
        ref={fileInputRef}
        type="file" 
        multiple 
        className="file-input-hidden"
        onChange={handleFileInputChange}
        style={{ display: 'none' }}
      />
    </div>
  );
}

function getFileIcon(filename) {
  if (!filename) return '📄';

  const extension = filename.split('.').pop()?.toLowerCase();

  switch(extension) {
    case 'pdf':
      return '📕';
    case 'doc':
    case 'docx':
      return '📝';
    case 'xls':
    case 'xlsx':
      return '📊';
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return '🖼️';
    default:
      return '📄';
  }
}