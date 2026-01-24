import { useState, useRef, useEffect } from 'react';
import {
  FaChevronLeft,
  FaChevronRight,
  FaDownload,
  FaPrint,
  FaSearch,
  FaTimes,
} from 'react-icons/fa';
import { CiZoomIn, CiZoomOut } from 'react-icons/ci';

const PDFViewer = ({ pdfUrl, title, onComplete, isCompleted, fileName, onClose }) => {
  const iframeRef = useRef(null);
  const [totalPages, setTotalPages] = useState(0);
  const [zoom, setZoom] = useState(70);
  const [isLoading, setIsLoading] = useState(true);
  const [pdfError, setPdfError] = useState(null);
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null);

  useEffect(() => {
    if (!pdfUrl) {
      setIsLoading(false);
      return;
    }

    const loadPdfBlob = async () => {
      try {
        setIsLoading(true);
        setPdfError(null);

        const response = await fetch(pdfUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        setPdfBlobUrl(blobUrl);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading PDF:', error);
        setPdfError('Failed to load PDF file. Please try again or download the file.');
        setIsLoading(false);
      }
    };

    loadPdfBlob();

    // Cleanup blob URL on unmount
    return () => {
      if (pdfBlobUrl) {
        URL.revokeObjectURL(pdfBlobUrl);
      }
    };
  }, [pdfUrl, pdfBlobUrl]);

  const handleDownload = () => {
    const link = document.createElement('a');
    // Use blob URL if available, otherwise use original URL
    link.href = pdfBlobUrl || pdfUrl;
    link.download = fileName || 'document.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Mark as completed after download
    if (!isCompleted && onComplete) {
      onComplete();
    }
  };

  const handlePrint = () => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow.print();
    }
  };

  const handleZoom = (direction) => {
    if (direction === 'in' && zoom < 200) {
      setZoom(zoom + 10);
    } else if (direction === 'out' && zoom > 50) {
      setZoom(zoom - 10);
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const openInNewTab = () => {
    window.open(pdfUrl, '_blank');
  };

  return (
    <div className="w-full bg-slate-100 rounded-xl overflow-hidden shadow-lg border border-slate-200">
      {/* Toolbar */}
      <div className="bg-white border-b border-slate-200 p-4 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-slate-900">{title || 'PDF Document'}</h3>
          {isCompleted && (
            <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">
              ✓ Completed
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Zoom Controls */}
          <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-2">
            <button
              onClick={() => handleZoom('out')}
              disabled={zoom <= 50}
              className="p-2 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-all text-slate-600"
              title="Zoom Out"
            >
              <CiZoomOut size={16} />
            </button>
            <span className="text-sm font-semibold text-slate-700 w-12 text-center">{zoom}%</span>
            <button
              onClick={() => handleZoom('in')}
              disabled={zoom >= 200}
              className="p-2 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-all text-slate-600"
              title="Zoom In"
            >
              <CiZoomIn size={16} />
            </button>
          </div>

          {/* Action Buttons */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all font-semibold"
            title="Print Document"
          >
            <FaPrint size={16} />
            <span className="hidden sm:inline">Print</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all font-semibold"
            title="Download PDF"
          >
            <FaDownload size={16} />
            <span className="hidden sm:inline">Download</span>
          </button>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all font-semibold"
            title="Close PDF"
          >
            <FaTimes size={16} />
            <span className="hidden sm:inline">Close</span>
          </button>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="relative w-full bg-slate-200 overflow-auto" style={{ height: 'calc(100vh - 300px)' }}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-slate-600 font-semibold">Loading PDF...</p>
            </div>
          </div>
        )}

        {pdfError && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-50 z-10">
            <div className="text-center max-w-sm mx-4">
              <p className="text-red-600 font-semibold mb-4">Cannot Display PDF in Viewer</p>
              <p className="text-red-500 text-sm mb-2">{pdfError}</p>
              <p className="text-slate-600 text-sm mb-6">This is likely due to browser security restrictions with localhost.</p>
              <p className="text-slate-600 text-sm mb-6 font-semibold">Try one of these options:</p>
              <div className="flex gap-3 justify-center flex-wrap">
                <button
                  onClick={openInNewTab}
                  className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all font-semibold"
                >
                  Open in New Tab
                </button>
                <button
                  onClick={handleDownload}
                  className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all font-semibold"
                >
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        )}

        <iframe
          ref={iframeRef}
          src={pdfBlobUrl ? `${pdfBlobUrl}#zoom=${zoom}` : ''}
          className="w-full h-full"
          title="PDF Viewer"
          onLoad={() => {
            try {
              const pdfViewer = iframeRef.current?.contentWindow?.PDFViewerApplication;
              if (pdfViewer) {
                setTotalPages(pdfViewer.pagesCount || 0);
              }
            } catch {
              console.log('Cannot access PDF viewer');
            }
          }}
          onError={() => {
            setPdfError('Cannot display PDF in embedded viewer due to browser restrictions.');
          }}
        />

        {/* Fallback if iframe doesn't work */}
        {!pdfUrl && !pdfError && (
          <div className="flex items-center justify-center h-full bg-slate-100">
            <div className="text-center">
              <p className="text-slate-600 font-semibold mb-4">No PDF URL provided</p>
              <button
                onClick={handleDownload}
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all"
              >
                Download PDF
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-slate-200 p-4 flex items-center justify-between flex-wrap gap-4">
        <div className="text-sm text-slate-600">
          {totalPages > 0 ? `Total Pages: ${totalPages}` : 'PDF Document'}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={openInNewTab}
            className="text-blue-600 hover:text-blue-700 text-sm font-semibold px-3 py-1 hover:bg-blue-50 rounded transition-all"
            title="Open PDF in new tab"
          >
            Open in New Tab
          </button>
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;
