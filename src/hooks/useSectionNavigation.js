import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook to handle section scrolling, hash navigation, and active section highlighting.
 * @param {string[]} sectionIds - Array of section IDs to monitor (without the #).
 * @param {number} offset - Offset to account for fixed header (default 80px).
 */
export const useSectionNavigation = (sectionIds, offset = 80) => {
  const [activeSection, setActiveSection] = useState('');

  // Function to scroll to a specific section
  const scrollToSection = useCallback((id, retryCount = 0) => {
    const element = document.getElementById(id);
    
    if (element) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      // Update hash without page reload
      if (window.location.hash !== `#${id}`) {
        window.history.pushState(null, '', `#${id}`);
      }
    } else if (retryCount < 10) {
      // Element not found yet, wait and retry (useful for async loading)
      setTimeout(() => scrollToSection(id, retryCount + 1), 200);
    }
  }, [offset]);

  // Handle initial hash on load and hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && sectionIds.includes(hash)) {
        // Use a small timeout to ensure components are rendered
        setTimeout(() => scrollToSection(hash), 100);
      }
    };

    // Initial check
    if (window.location.hash) {
      handleHashChange();
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [sectionIds, scrollToSection]);

  // Monitor scroll position to update active section
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + offset + 10; // Add small buffer

      // Find the section that is currently in view
      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (element) {
          const { top, bottom } = element.getBoundingClientRect();
          const absoluteTop = top + window.pageYOffset;
          const absoluteBottom = bottom + window.pageYOffset;

          if (scrollPosition >= absoluteTop && scrollPosition < absoluteBottom) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionIds, offset]);

  return { activeSection, scrollToSection };
};
