import React, { useState } from 'react';
import './LinkCard.css'
import { HugeiconsIcon } from '@hugeicons/react'
import { ExternalLinkIcon } from '@hugeicons/core-free-icons'
import { TagsIcon } from '@hugeicons/core-free-icons'


// Define Link type
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

  const [showFullDescription, setShowFullDescription] = useState(false);

  return (
    <div className="link-card" onClick={handleVisitLink}>
      <div className="link-card-header">
        <div className="link-info">
          <h3 className="link-title">{link.title}</h3>
          <div className="link-url">
            <span className="domain">{getDomainFromUrl(link.url)}</span>
            <HugeiconsIcon icon={ExternalLinkIcon} size={20} />
          </div>
          <div className="description-wrapper">
            <p
              className={`link-description ${showFullDescription ? 'expanded' : ''
                }`}
              onClick={(e) => {
                e.stopPropagation();
                setShowFullDescription(!showFullDescription);
              }}
            >
              {link.description} 
            </p>

            <button
              className="show-more-btn"
              onClick={(e) => {
                e.stopPropagation();
                setShowFullDescription(!showFullDescription);
              }}
            >
              {showFullDescription ? 'Show less' : 'Show more'}
            </button>
          </div>
        </div>
        <div className="link-actions">
          <button
            className="action-btn delete-btn"
            onClick={handleDeleteClick}
            title="Delete link"
          >
            Delete
          </button>
          <button
            className="action-btn edit-btn"
            onClick={handleEditClick}
            title="Edit link"
          >
            Edit
          </button>
        </div>
      </div>
      {link.tags.length > 0 && (
        <div className="link-tags">
          <HugeiconsIcon icon={TagsIcon} />
          {link.tags.map((tag, index) => (
            <span key={index} className="tag">
              #{tag.trim()}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};