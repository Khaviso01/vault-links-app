// Define Link interface directly in this file
interface Link {
  id: string;
  title: string;
  url: string;
  description: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const STORAGE_KEY = 'link-vault-links';

export const localStorageUtils = {
  // Get all links from localStorage
  getLinks: (): Link[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      const links = JSON.parse(stored);
      // Convert date strings back to Date objects
      return links.map((link: any) => ({
        ...link,
        createdAt: new Date(link.createdAt),
        updatedAt: new Date(link.updatedAt)
      }));
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  },

  // Save all links to localStorage
  saveLinks: (links: Link[]): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },

  // Add a new link
  addLink: (linkData: Omit<Link, 'id' | 'createdAt' | 'updatedAt'>): Link => {
    const links = localStorageUtils.getLinks();
    const newLink: Link = {
      ...linkData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    links.push(newLink);
    localStorageUtils.saveLinks(links);
    return newLink;
  },

  // Update an existing link
  updateLink: (id: string, updates: Partial<Omit<Link, 'id' | 'createdAt'>>): Link | null => {
    const links = localStorageUtils.getLinks();
    const linkIndex = links.findIndex(link => link.id === id);
    
    if (linkIndex === -1) return null;
    
    const updatedLink = {
      ...links[linkIndex],
      ...updates,
      updatedAt: new Date()
    };
    
    links[linkIndex] = updatedLink;
    localStorageUtils.saveLinks(links);
    return updatedLink;
  },

  // Delete a link
  deleteLink: (id: string): boolean => {
    const links = localStorageUtils.getLinks();
    const filteredLinks = links.filter(link => link.id !== id);
    
    if (filteredLinks.length === links.length) return false;
    
    localStorageUtils.saveLinks(filteredLinks);
    return true;
  },

  // Search links
  searchLinks: (query: string, searchBy: string = 'all'): Link[] => {
    const links = localStorageUtils.getLinks();
    if (!query.trim()) return links;
    
    const searchTerm = query.toLowerCase();
    
    return links.filter(link => {
      switch (searchBy) {
        case 'title':
          return link.title.toLowerCase().includes(searchTerm);
        case 'url':
          return link.url.toLowerCase().includes(searchTerm);
        case 'description':
          return link.description.toLowerCase().includes(searchTerm);
        case 'tags':
          return link.tags.some(tag => tag.toLowerCase().includes(searchTerm));
        case 'all':
        default:
          return (
            link.title.toLowerCase().includes(searchTerm) ||
            link.url.toLowerCase().includes(searchTerm) ||
            link.description.toLowerCase().includes(searchTerm) ||
            link.tags.some(tag => tag.toLowerCase().includes(searchTerm))
          );
      }
    });
  }
};