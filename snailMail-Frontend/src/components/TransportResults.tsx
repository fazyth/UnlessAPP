import { useState } from 'react';
import type { DeliveryEstimate } from '../services/api';
import TransportMode from './TransportMode';
import type { TransportType } from './TransportMode';
import './TransportResults.css';

interface TransportResultsProps {
  results: Record<string, DeliveryEstimate>;
  origin: string;
  destination: string;
  onReset: () => void;
}

interface TransportOption {
  type: TransportType;
  emoji: string;
  speedDisplay: string;
  description: string;
  estimate: DeliveryEstimate;
}

const TransportResults = ({ results, origin, destination, onReset }: TransportResultsProps) => {
  const [selectedTransport, setSelectedTransport] = useState<TransportType | null>(null);

  const transportDescriptions: Record<TransportType, { emoji: string; description: string }> = {
    pigeon: {
      emoji: '🕊️',
      description: 'Air mail at its finest! A trusty pigeon carries your message through the skies.',
    },
    walking: {
      emoji: '🚶',
      description: 'The classic approach. Your message walks to its destination, one step at a time.',
    },
    swimming: {
      emoji: '🏊',
      description: 'For water-based delivery. Your message swims across rivers, lakes, and oceans.',
    },
    'rock-climbing': {
      emoji: '🧗',
      description: 'The most adventurous route. Your message climbs mountains to reach its destination.',
    },
  };

  const transportOptions: TransportOption[] = Object.entries(results).map(([mode, estimate]) => ({
    type: mode as TransportType,
    emoji: transportDescriptions[mode as TransportType].emoji,
    speedDisplay: `${estimate.speedKmH} km/h`,
    description: transportDescriptions[mode as TransportType].description,
    estimate,
  }));

  // Sort by delivery time (fastest first)
  transportOptions.sort((a, b) => a.estimate.deliveryTimeSeconds - b.estimate.deliveryTimeSeconds);

  const handleTransportClick = (transport: TransportOption) => {
    setSelectedTransport(selectedTransport === transport.type ? null : transport.type);
  };

  return (
    <div className="transport-results">
      <div className="results-header">
        <h2 className="results-title">🎯 Delivery Options</h2>
        <div className="route-summary">
          <div className="route-info">
            <span className="route-label">From:</span>
            <span className="route-value">{origin}</span>
          </div>
          <div className="route-arrow">→</div>
          <div className="route-info">
            <span className="route-label">To:</span>
            <span className="route-value">{destination}</span>
          </div>
        </div>

        {transportOptions.length > 0 && (
          <div className="distance-summary">
            <span className="distance-icon">📏</span>
            <span className="distance-text">
              Total Distance: <strong>{transportOptions[0].estimate.distanceText}</strong>
            </span>
            {transportOptions[0].estimate.method === 'claude-estimate' && (
              <span className="estimate-badge" title="Google Maps was unavailable, using AI estimation">
                ✨ AI Estimate
              </span>
            )}
          </div>
        )}
      </div>

      <div className="transport-grid">
        {transportOptions.map((transport) => (
          <div
            key={transport.type}
            className={`transport-card-wrapper ${
              selectedTransport === transport.type ? 'selected' : ''
            }`}
            onClick={() => handleTransportClick(transport)}
          >
            <div className="transport-header">
              <h3 className="transport-name">
                {transport.emoji} {transport.type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
              </h3>
              <div className="delivery-time-badge">
                {transport.estimate.deliveryTimeText}
              </div>
            </div>

            <TransportMode
              type={transport.type}
              speed={transport.speedDisplay}
              description={transport.description}
            />

            {selectedTransport === transport.type && (
              <div className="transport-details">
                <div className="detail-row">
                  <span className="detail-label">Distance:</span>
                  <span className="detail-value">{transport.estimate.distanceText}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Speed:</span>
                  <span className="detail-value">{transport.estimate.speedKmH} km/h</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Delivery Time:</span>
                  <span className="detail-value highlight">{transport.estimate.deliveryTimeText}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Route:</span>
                  <span className="detail-value small">
                    {transport.estimate.origin} → {transport.estimate.destination}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="results-actions">
        <button className="reset-button" onClick={onReset}>
          🔄 Calculate New Route
        </button>
      </div>

      <div className="results-footer">
        <p className="footer-note">
          💡 <strong>Tip:</strong> Click on any transport method to see detailed information!
        </p>
      </div>
    </div>
  );
};

export default TransportResults;
