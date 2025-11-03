import React from 'react';
import './Header.css';

function Header() {
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
      </div>
    </header>
  );
}

export default Header;
