import React, { useRef } from 'react';
import './Header.css';

function Header({ onExport, onImport }) {
  const fileInputRef = useRef(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="spider-web-bg"></div>
        <h1 className="title">
          <span className="spider-icon">🕷️</span>
          Spider-Man MTG Collection
          <span className="spider-icon">🕸️</span>
        </h1>
        <p className="subtitle">Your friendly neighborhood card tracker</p>

        <div className="collection-actions">
          <button className="action-btn export-btn" onClick={onExport} title="Export your collection">
            <span className="btn-icon">📥</span>
            Export Collection
          </button>
          <button className="action-btn import-btn" onClick={handleImportClick} title="Import a collection">
            <span className="btn-icon">📤</span>
            Import Collection
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={onImport}
            style={{ display: 'none' }}
          />
        </div>
      </div>
    </header>
  );
}

export default Header;
