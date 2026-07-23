import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { localStorageUtils } from '../../LocalStorage/localStorage';
import { LinkForm } from '../../components/LinkForm/LinkForm';
import { LinkCard } from '../../components/LinkCard/LinkCard';
import { SearchBar } from '../../components/Searchbar/Searchbar';
import { TagTabs } from '../../components/TagTabs/TagTabs';
import { Notification } from '../../components/Notification/Notification';
import { HugeiconsIcon } from '@hugeicons/react'
import { Bookmark02Icon } from '@hugeicons/core-free-icons'
import { FolderLinksIcon } from '@hugeicons/core-free-icons'

 
import './LinkVault.css';

// Define types directly in this component
interface Link {
  id: string;
  title: string;
  url: string;
  description: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface LinkFormData {
  title: string;
  url: string;
  description: string;
  tags: string;
}

interface SearchFilters {
  query: string;
  searchBy: 'all' | 'title' | 'url' | 'description' | 'tags';
}

interface NotificationState {
  message: string;
  type: 'success' | 'error' | 'info';
  isVisible: boolean;
}

export const LinkVault: React.FC = () => {
  const [links, setLinks] = useState<Link[]>([]);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({ query: '', searchBy: 'all' });
  const [activeTag, setActiveTag] = useState<string>('All');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<Link | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<NotificationState>({
    message: '',
    type: 'info',
    isVisible: false
  });

  // Load links from localStorage on component mount
  useEffect(() => {
    const savedLinks = localStorageUtils.getLinks();
    setLinks(savedLinks);
  }, []);

  // Show notification helper
  const showNotification = useCallback((message: string, type: NotificationState['type'] = 'info') => {
    setNotification({ message, type, isVisible: true });
  }, []);

  // Hide notification
  const hideNotification = useCallback(() => {
    setNotification(prev => ({ ...prev, isVisible: false }));
  }, []);

  // Handle search — just stores the current filter criteria; actual
  // filtering happens in the `filteredLinks` memo below.
  const handleSearch = useCallback((filters: SearchFilters) => {
    setSearchFilters(filters);
  }, []);

  // Unique tags across all links, used to render the tabs
  const uniqueTags = useMemo(() => {
    const tagSet = new Set<string>();
    links.forEach(link => link.tags.forEach(tag => tagSet.add(tag)));
    return Array.from(tagSet).sort((a, b) => a.localeCompare(b));
  }, [links]);

  // Combined result of the active tag filter + the search filter.
  const filteredLinks = useMemo(() => {
    let result = links;

    if (activeTag !== 'All') {
      result = result.filter(link => link.tags.includes(activeTag));
    }

    const term = searchFilters.query.trim().toLowerCase();
    if (term) {
      result = result.filter(link => {
        switch (searchFilters.searchBy) {
          case 'title':
            return link.title.toLowerCase().includes(term);
          case 'url':
            return link.url.toLowerCase().includes(term);
          case 'description':
            return link.description.toLowerCase().includes(term);
          case 'tags':
            return link.tags.some(tag => tag.toLowerCase().includes(term));
          default:
            return (
              link.title.toLowerCase().includes(term) ||
              link.url.toLowerCase().includes(term) ||
              link.description.toLowerCase().includes(term) ||
              link.tags.some(tag => tag.toLowerCase().includes(term))
            );
        }
      });
    }

    return result;
  }, [links, activeTag, searchFilters]);

  // Handle adding new link
  const handleAddLink = async (formData: LinkFormData) => {
    setIsLoading(true);
    try {
      const linkData = {
        title: formData.title.trim(),
        url: formData.url.trim(),
        description: formData.description.trim(),
        tags: formData.tags
          .split(',')
          .map(tag => tag.trim())
          .filter(tag => tag.length > 0)
      };

      const newLink = localStorageUtils.addLink(linkData);
      setLinks(prev => [...prev, newLink]);
      setIsFormOpen(false);
      showNotification('Link added successfully!', 'success');
    } catch (error) {
      showNotification('Failed to add link. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle editing link
  const handleEditLink = async (formData: LinkFormData) => {
    if (!editingLink) return;
    
    setIsLoading(true);
    try {
      const updates = {
        title: formData.title.trim(),
        url: formData.url.trim(),
        description: formData.description.trim(),
        tags: formData.tags
          .split(',')
          .map(tag => tag.trim())
          .filter(tag => tag.length > 0)
      };

      const updatedLink = localStorageUtils.updateLink(editingLink.id, updates);
      if (updatedLink) {
        setLinks(prev => prev.map(l => (l.id === updatedLink.id ? updatedLink : l)));
        setIsFormOpen(false);
        setEditingLink(null);
        showNotification('Link updated successfully!', 'success');
      } else {
        showNotification('Failed to update link. Link not found.', 'error');
      }
    } catch (error) {
      showNotification('Failed to update link. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle deleting link
  const handleDeleteLink = async (id: string) => {
    try {
      const success = localStorageUtils.deleteLink(id);
      if (success) {
        setLinks(prev => prev.filter(l => l.id !== id));
        showNotification('Link deleted successfully!', 'success');
      } else {
        showNotification('Failed to delete link. Link not found.', 'error');
      }
    } catch (error) {
      showNotification('Failed to delete link. Please try again.', 'error');
    }
  };

  // Open form for adding new link
  const openAddForm = () => {
    setEditingLink(null);
    setIsFormOpen(true);
  };

  // Open form for editing existing link
  const openEditForm = (link: Link) => {
    setEditingLink(link);
    setIsFormOpen(true);
  };

  // Close form
  const closeForm = () => {
    setIsFormOpen(false);
    setEditingLink(null);
  };

  // Handle form submission
  const handleFormSubmit = (formData: LinkFormData) => {
    if (editingLink) {
      handleEditLink(formData);
    } else {
      handleAddLink(formData);
    }
  };

  return (
    <div className="link-vault">
      <div className="link-vault-header">
        <div className="header-content">
          <h1 className="vault-title">
            <span className="vault-icon">
              <HugeiconsIcon icon={FolderLinksIcon} />
            </span>
            Link Vault
          </h1>
          <p className="vault-subtitle">
            Your personal bookmark manager - save, organize, and access your favorite links from anywhere
          </p>
        </div>
        <button 
          className="add-link-btn"
          onClick={openAddForm}
          disabled={isLoading}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add New Link
        </button>
      </div>

      {uniqueTags.length > 0 && (
        <TagTabs
          tags={uniqueTags}
          activeTag={activeTag}
          onSelect={setActiveTag}
        />
      )}

      <SearchBar 
        onSearch={handleSearch}
        totalLinks={links.length}
        filteredCount={filteredLinks.length}
      />

      <div className="links-container">
        {filteredLinks.length === 0 ? (
          <div className="empty-state">
            {links.length === 0 ? (
              <>
                <div className="empty-icon">
                  <HugeiconsIcon icon={Bookmark02Icon} />
                </div>
                <h3>No links bookmarked yet!</h3>
                <p>Start building your link collection by adding your first bookmark</p>

              </>
            ) : (
              <>
                <div className="empty-icon">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                </div>
                <h3>No links found</h3>
                <p>Try adjusting your search terms or filters to find what you're looking for.</p>
              </>
            )}
          </div>
        ) : (
          <div className="links-grid">
            {filteredLinks.map((link) => (
              <LinkCard
                key={link.id}
                link={link}
                onEdit={openEditForm}
                onDelete={handleDeleteLink}
              />
            ))}
          </div>
        )}
      </div>

      {isFormOpen && (
        <LinkForm
          onSubmit={handleFormSubmit}
          onCancel={closeForm}
          editingLink={editingLink}
          isLoading={isLoading}
        />
      )}

      <Notification
        notification={notification}
        onClose={hideNotification}
      />
    </div>
  );
};