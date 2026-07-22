import React from 'react';
import './TagTabs.css';

interface TagTabsProps {
  tags: string[];
  activeTag: string;
  onSelect: (tag: string) => void;
}

export const TagTabs: React.FC<TagTabsProps> = ({ tags, activeTag, onSelect }) => {
  const options = ['All', ...tags];

  return (
    <div className="tag-tabs" role="tablist" aria-label="Filter links by tag">
      {options.map((tag) => (
        <button
          key={tag}
          type="button"
          role="tab"
          aria-selected={activeTag === tag}
          className={`tag-tab ${activeTag === tag ? 'tag-tab-active' : ''}`}
          onClick={() => onSelect(tag)}
        >
          {tag}
        </button>
      ))}
    </div>
  );
};
