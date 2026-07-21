import React, { useState, useEffect, useCallback } from 'react';
import { localStorageUtils } from '../../LocalStorage/localStorage';
import { LinkForm } from '../../components/LinkForm/LinkForm';
import { LinkCard } from '../../components/LinkCard/LinkCard';
import { SearchBar } from '../../components/Searchbar/Searchbar';
import { Notification } from '../../components/Notification/Notification';
import { HugeiconsIcon } from '@hugeicons/react'
import { Bookmark02Icon } from '@hugeicons/core-free-icons'
import { Link01Icon } from '@hugeicons/core-free-icons'
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
  const [filteredLinks, setFilteredLinks] = useState<Link[]>([]);
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
    setFilteredLinks(savedLinks);
  }, []);

  // Show notification helper
  const showNotification = useCallback((message: string, type: NotificationState['type'] = 'info') => {
    setNotification({ message, type, isVisible: true });
  }, []);

  // Hide notification
  const hideNotification = useCallback(() => {
    setNotification(prev => ({ ...prev, isVisible: false }));
  }, []);

  // Handle search
  const handleSearch = useCallback((filters: SearchFilters) => {
    if (!filters.query.trim()) {
      setFilteredLinks(links);
      return;
    }

    const results = localStorageUtils.searchLinks(filters.query, filters.searchBy);
    setFilteredLinks(results);
  }, [links]);

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

      localStorageUtils.addLink(linkData);
      const updatedLinks = localStorageUtils.getLinks();
      setLinks(updatedLinks);
      setFilteredLinks(updatedLinks);
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
        const updatedLinks = localStorageUtils.getLinks();
        setLinks(updatedLinks);
        setFilteredLinks(updatedLinks);
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
        const updatedLinks = localStorageUtils.getLinks();
        setLinks(updatedLinks);
        setFilteredLinks(updatedLinks);
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
              <HugeiconsIcon icon={Link01Icon} />
            </span>
            Link Vault
          </h1>
          <p className="vault-subtitle">
            Your personal bookmark manager - securely save, organize, and access your favorite links from anywhere
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
                <h3>No links saved yet</h3>
                <p>Get started with adding first bookmark!</p>
                <button className="empty-action-btn" onClick={openAddForm}>
                  Save Your First Link!
                </button>
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