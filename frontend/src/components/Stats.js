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

          {stats.setCompletion && stats.setCompletion.length > 0 && (
            <div className="stat-item set-progress-item-container">
              <div className="set-progress-bars">
                {stats.setCompletion.map(set => (
                  <div key={set.setCode} className="set-progress-item">
                    <span className="set-code">{set.setCode}</span>
                    <div className="set-progress-bar-container">
                      <div
                        className="set-progress-bar-fill"
                        style={{ width: `${set.percentage}%` }}
                      />
                    </div>
                    <span className="set-percentage">{set.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Stats;
