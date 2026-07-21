import React, { useState, useEffect } from 'react';
import { Search01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import './Searchbar.css';

// Define SearchFilters type directly in this component
interface SearchFilters {
  query: string;
  searchBy: 'all' | 'title' | 'url' | 'description' | 'tags';
}

interface SearchBarProps {
  onSearch: (filters: SearchFilters) => void;
  totalLinks: number;
  filteredCount: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  totalLinks, 
  filteredCount 
}) => {
  const [query, setQuery] = useState('');



  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch({ query, searchBy: 'all' });
    }, 300); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [query, onSearch]);

  const handleClearSearch = () => {
    setQuery('');

  };



  return (
    <div className="search-bar-container">
      <div className="search-bar">
        <div className="search-input-container">
          <div className="search-icon">
            <HugeiconsIcon icon={Search01Icon} />
          </div>
          <input
            type="text"
            placeholder="Search your links by title, tags, link or description"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-input"
          />
          {query && (
            <button 
              className="clear-search-btn"
              onClick={handleClearSearch}
              title="Clear search"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>


      </div>



      <div className="search-results-info">
        {query ? (
          <span className="results-count">
            {filteredCount === 0 ? 'No links found' : 
             filteredCount === 1 ? '1 link found' : 
             `${filteredCount} links found`}
            {totalLinks > 0 && ` out of ${totalLinks} total`}
          </span>
        ) : (
          <span className="total-count">
            {totalLinks === 0 ? 'You have no links saved yet' :
             totalLinks === 1 ? '1 link saved' :
             `${totalLinks} links saved`}
          </span>
        )}
      </div>
    </div>
  );
};