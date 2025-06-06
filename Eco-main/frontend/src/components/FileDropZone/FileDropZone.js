import React, { useState,useEffect } from 'react';
import "./FileDropZone.css"

function FileDropZone() {
  const [droppedFiles, setDroppedFiles] = useState([]);
  // Only for desktops
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const handleResize = () => {
    setIsDesktop(window.innerWidth >= 1024);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isDesktop) {
    return <></>; 
  }

  const handleDrop = (e) => {
    e.preventDefault();
    const newFiles = [...droppedFiles, ...e.dataTransfer.files];
    setDroppedFiles(newFiles);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="file-drop-zone">

        {/* Rendered files */}
      <div className="file-list">
        {droppedFiles.map((file, index) => (
          <div className="file-item" key={index}>
            <p className="file-name">{file.name}</p>
            <p className="file-type">{file.type}</p>
            <img className="file-icon" src={getFileIcon(file.type)} alt={file.name} />
            <button className="download-button" onClick={() => handleDownload(file)}>Download</button>
          </div>
        ))}
      </div>
      
      {/* Drop zone */}
      <div
        className="drop-area"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <p>Drag and drop files here.</p>
      </div>
    
      
    </div>
  );
}

function getFileIcon(fileType) {
  // Implement logic to determine the appropriate icon based on file type
  if (fileType.startsWith('image/')) {
    return '/images/icons/img_icon.png'; //  image icon path
  } else if (fileType === 'application/pdf') {
    return '/images/icons/pdf_icon.png'; //  PDF icon path
  } else {
    return 'default-icon.png'; 
  }
}

function handleDownload(file) {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);   
  
    URL.revokeObjectURL(url);   
  
  }

export default FileDropZone;