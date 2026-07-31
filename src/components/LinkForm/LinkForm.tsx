import React, { useState, useEffect } from 'react';
import './LinkForm.css';

// Link shape used for editing existing entries.
interface Link {
  id: string;
  title: string;
  url: string;
  description: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Form input values managed by this component.
interface LinkFormData {
  title: string;
  url: string;
  description: string;
  tags: string;
}

// Props accepted by the LinkForm component.
interface LinkFormProps {
  onSubmit: (data: LinkFormData) => void;
  onCancel: () => void;
  editingLink?: Link | null;
  isLoading?: boolean;
}

export const LinkForm: React.FC<LinkFormProps> = ({
  onSubmit,
  onCancel,
  editingLink,
  isLoading = false
}) => {
  // Form values for title, URL, description, and comma-separated tags
  const [formData, setFormData] = useState<LinkFormData>({
    title: '',
    url: '',
    description: '',
    tags: ''
  });

  // Per-field validation errors shown to the user
  const [errors, setErrors] = useState<Partial<LinkFormData>>({});

  // Populate form fields when editing an existing link
  useEffect(() => {
    if (editingLink) {
      setFormData({
        title: editingLink.title,
        url: editingLink.url,
        description: editingLink.description,
        tags: editingLink.tags.join(', ')
      });
    } else {
      setFormData({
        title: '',
        url: '',
        description: '',
        tags: ''
      });
    }
    setErrors({});
  }, [editingLink]);

  // Validate form fields and return whether the current input is valid
  const validateForm = (): boolean => {
    const newErrors: Partial<LinkFormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.url.trim()) {
      newErrors.url = 'URL is required';
    } else {
      // Basic URL validation to ensure the value resembles a URL
      const urlPattern = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+(\/.*)?$/;
      if (!urlPattern.test(formData.url)) {
        newErrors.url = 'Please enter a valid URL';
      }
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit the form after validation and pass values up to the parent
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  // Update form state for text fields and clear any field-level errors
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear the error message once the user begins fixing the field
    if (errors[name as keyof LinkFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // Ensuring URL input is formatted with a protocol when the field loses focus
  const formatUrl = (url: string): string => {
    if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://${url}`;
    }
    return url;
  };

  const handleUrlBlur = () => {
    if (formData.url) {
      setFormData(prev => ({ ...prev, url: formatUrl(prev.url) }));
    }
  };

  return (
    <div className="link-form-overlay">
      <div className="link-form-container">
        <div className="link-form-header">
          <h2>{editingLink ? 'Edit Link' : 'Add New Link'}</h2>
          <button 
            type="button" 
            className="close-btn"
            onClick={onCancel}
            disabled={isLoading}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="link-form">
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={errors.title ? 'error' : ''}
              placeholder="Enter link title"
              disabled={isLoading}
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="url">URL *</label>
            <input
              type="url"
              id="url"
              name="url"
              value={formData.url}
              onChange={handleInputChange}
              onBlur={handleUrlBlur}
              className={errors.url ? 'error' : ''}
              placeholder="https://example.com"
              disabled={isLoading}
            />
            {errors.url && <span className="error-message">{errors.url}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className={errors.description ? 'error' : ''}
              placeholder="Describe what this link is about"
              rows={3}
              disabled={isLoading}
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="tags">Tags</label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              placeholder="(e.g., tutorial, react, music)"
              disabled={isLoading}
            />
            <small className="form-hint">note* seperate tags by commas</small>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : (editingLink ? 'Update Link' : 'Add Link')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};