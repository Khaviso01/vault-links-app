import React from 'react'
import './LinkCard.css'
import { HugeiconsIcon } from '@hugeicons/react'
import { Edit02Icon } from '@hugeicons/core-free-icons'
import { Delete02Icon } from '@hugeicons/core-free-icons'
import { ExternalLinkIcon } from '@hugeicons/core-free-icons'


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

    // Ensuring URL has protocol
    const url = link.url.startsWith('http') ? link.url : `https://${link.url}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };


  // Date format after CRUD process
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
            <HugeiconsIcon icon={ExternalLinkIcon} size={20} />
          </div>
        </div>
        <div className="link-actions">
          <button
            className="action-btn edit-btn"
            onClick={handleEditClick}
            title="Edit link"
          >
            <HugeiconsIcon icon={Edit02Icon} size={20} />
          </button>
          <button
            className="action-btn delete-btn"
            onClick={handleDeleteClick}
            title="Delete link"
          >
            <HugeiconsIcon icon={Delete02Icon} size={20} />
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