import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook to handle section scrolling, hash navigation, and active section highlighting.
 * @param {string[]} sectionIds - Array of section IDs to monitor (without the #).
 * @param {number} offset - Offset to account for fixed header (default 80px).
 */
export const useSectionNavigation = (sectionIds, offset = 80) => {
  const [activeSection, setActiveSection] = useState('');

  // Function to scroll to a specific section with retries for late-loading components
  const scrollToSection = useCallback((id, retryCount = 0) => {
    const element = document.getElementById(id);
    
    if (element) {
      // Small delay to ensure any layout shifts have occurred
      setTimeout(() => {
        const offsetPosition = element.offsetTop - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        
        // Update hash without page reload
        if (window.location.hash !== `#${id}`) {
          window.history.replaceState(null, '', `#${id}`);
        }
      }, 50);
    } else if (retryCount < 15) {
      // Element not found/rendered yet, wait and retry
      setTimeout(() => scrollToSection(id, retryCount + 1), 200);
    }
  }, [offset]);

  // Handle deep linking on mount and hash changes
  useEffect(() => {
    const handleInitialScroll = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && sectionIds.includes(hash)) {
        // Longer initial timeout for Vercel/production loads
        setTimeout(() => scrollToSection(hash), 500);
      }
    };

    // Use multiple triggers to catch different load stages
    handleInitialScroll();
    window.addEventListener('load', handleInitialScroll);
    window.addEventListener('hashchange', handleInitialScroll);

    return () => {
      window.removeEventListener('load', handleInitialScroll);
      window.removeEventListener('hashchange', handleInitialScroll);
    };
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
