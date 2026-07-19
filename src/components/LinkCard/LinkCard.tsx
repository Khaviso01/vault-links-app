import React from 'react';
import './LinkCard.css';

// Define Link type directly in this component
interface Link {
  id: string;
  title: string;
  url: string;
  description: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface LinkCardProps {
  link: Link;
  onEdit: (link: Link) => void;
  onDelete: (id: string) => void;
}

export const LinkCard: React.FC<LinkCardProps> = ({ link, onEdit, onDelete }) => {
  const handleVisitLink = () => {
    // Ensure URL has protocol
    const url = link.url.startsWith('http') ? link.url : `https://${link.url}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getDomainFromUrl = (url: string) => {
    try {
      const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
      return urlObj.hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this link?')) {
      onDelete(link.id);
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(link);
  };

  return (
    <div className="link-card" onClick={handleVisitLink}>
      <div className="link-card-header">
        <div className="link-info">
          <h3 className="link-title">{link.title}</h3>
          <div className="link-url">
            <span className="domain">{getDomainFromUrl(link.url)}</span>
            <svg className="external-link-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15,3 21,3 21,9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </div>
        </div>
        <div className="link-actions">
          <button 
            className="action-btn edit-btn"
            onClick={handleEditClick}
            title="Edit link"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button 
            className="action-btn delete-btn"
            onClick={handleDeleteClick}
            title="Delete link"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3,6 5,6 21,6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
          </button>
        </div>
      </div>

      <p className="link-description">{link.description}</p>

      {link.tags.length > 0 && (
        <div className="link-tags">
          {link.tags.map((tag, index) => (
            <span key={index} className="tag">
              #{tag.trim()}
            </span>
          ))}
        </div>
      )}

      <div className="link-meta">
        <div className="link-dates">
          <span className="created-date">Created: {formatDate(link.createdAt)}</span>
          {link.updatedAt.getTime() !== link.createdAt.getTime() && (
            <span className="updated-date">Updated: {formatDate(link.updatedAt)}</span>
          )}
        </div>
      </div>
    </div>
  );
};