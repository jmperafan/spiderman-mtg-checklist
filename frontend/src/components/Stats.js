import React from 'react';
import './Stats.css';

function Stats({ stats }) {
  return (
    <div className="stats-container">
      <div className="integrated-stats-card">
        <div className="stats-header">
          <div className="stat-item">
            <div className="stat-icon">📊</div>
            <div className="stat-details">
              <div className="stat-label">Set Completion</div>
              <div className="stat-value">{stats.uniqueOwned} / {stats.totalCards}</div>
              <div className="stat-percentage">{stats.percentage}%</div>
            </div>
          </div>

          <div className="stat-item">
            <div className="stat-icon">✦</div>
            <div className="stat-details">
              <div className="stat-label">Master Set</div>
              <div className="stat-value">{stats.ownedMasterCards} / {stats.totalMasterCards}</div>
              <div className="stat-percentage">{stats.masterPercentage}%</div>
            </div>
          </div>

          <div className="stat-item">
            <div className="stat-icon">💰</div>
            <div className="stat-details">
              <div className="stat-label">Collection Value</div>
              <div className="stat-value">${stats.ownedValue}</div>
              <div className="stat-subtext">of ${stats.totalValue} total</div>
            </div>
          </div>
        </div>

        <div className="progress-bars">
          <div className="progress-section">
            <div className="progress-label-top">Set Completion</div>
            <div className="progress-bar-container">
              <div
                className="progress-bar-fill"
                style={{ width: `${stats.percentage}%` }}
              >
                <span className="progress-label">{stats.percentage}%</span>
              </div>
            </div>
          </div>

          <div className="progress-section">
            <div className="progress-label-top">Master Set (with Foils)</div>
            <div className="progress-bar-container master">
              <div
                className="progress-bar-fill master"
                style={{ width: `${stats.masterPercentage}%` }}
              >
                <span className="progress-label">{stats.masterPercentage}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Stats;
