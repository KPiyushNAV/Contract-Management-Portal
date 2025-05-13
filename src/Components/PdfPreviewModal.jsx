import React, { useState } from 'react';
import './PDFPreviewModal.css';
import { Document, Page, pdfjs } from 'react-pdf';
import { FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// Set the pdf.js worker source
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PDFPreviewModal = ({ file, filename, onClose }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setLoading(false);
  };

  const onDocumentLoadError = (error) => {
    console.error('Error loading PDF:', error);
    setError('Failed to load the document. It may not be a valid PDF.');
    setLoading(false);
  };

  const changePage = (offset) => {
    setPageNumber(prevPageNumber => {
      const newPage = prevPageNumber + offset;
      if (newPage > 0 && newPage <= numPages) {
        return newPage;
      }
      return prevPageNumber;
    });
  };

  const previousPage = () => changePage(-1);
  const nextPage = () => changePage(1);

  return (
    <div className="pdf-preview-overlay">
      <div className="pdf-preview-modal">
        <div className="pdf-preview-header">
          <h3>{filename || 'Document Preview'}</h3>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="pdf-preview-content">
          {loading && (
            <div className="pdf-loading">
              <div className="loading-spinner"></div>
              <p>Loading document...</p>
            </div>
          )}

          {error && (
            <div className="pdf-error">
              <p>{error}</p>
              <p>This might not be a valid PDF file or the file might be corrupted.</p>
            </div>
          )}

          <Document
            file={file}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={<div>Loading document...</div>}
          >
            <Page 
              pageNumber={pageNumber} 
              renderTextLayer={false} 
              renderAnnotationLayer={false}
              scale={1}
            />
          </Document>
        </div>

        {numPages > 0 && (
          <div className="pdf-controls">
            <button 
              onClick={previousPage} 
              disabled={pageNumber <= 1}
              className={pageNumber <= 1 ? 'disabled' : ''}
            >
              <FaChevronLeft /> Previous
            </button>
            
            <p className="page-info">
              Page {pageNumber} of {numPages}
            </p>
            
            <button 
              onClick={nextPage} 
              disabled={pageNumber >= numPages}
              className={pageNumber >= numPages ? 'disabled' : ''}
            >
              Next <FaChevronRight />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFPreviewModal;