import React, { useState, useEffect, useCallback } from 'react';
import { localStorageUtils } from '../../LocalStorage/localStorage';
import { LinkForm } from '../../components/LinkForm/LinkForm';
import { LinkCard } from '../../components/LinkCard/LinkCard';
import { SearchBar } from '../../components/Searchbar/Searchbar';
import { Notification } from '../../components/Notification/Notification';
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

  
};