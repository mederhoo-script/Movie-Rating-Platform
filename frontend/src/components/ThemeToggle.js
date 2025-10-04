import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const { theme, changeTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const themes = [
    { value: 'dark', label: 'Dark', icon: '🌙' },
    { value: 'light', label: 'Light', icon: '☀️' },
    { value: 'system', label: 'System', icon: '💻' },
  ];

  const currentThemeObj = themes.find(t => t.value === theme);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleThemeChange = (newTheme) => {
    changeTheme(newTheme);
    setIsOpen(false);
  };

  return (
    <div className="theme-toggle" ref={dropdownRef}>
      <button
        className="theme-toggle-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle theme"
        aria-expanded={isOpen}
      >
        <span className="theme-icon">{currentThemeObj?.icon}</span>
        <span className="theme-label">{currentThemeObj?.label}</span>
        <span className={`theme-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>
      
      {isOpen && (
        <div className="theme-dropdown">
          {themes.map((themeOption) => (
            <button
              key={themeOption.value}
              className={`theme-option ${theme === themeOption.value ? 'active' : ''}`}
              onClick={() => handleThemeChange(themeOption.value)}
            >
              <span className="theme-icon">{themeOption.icon}</span>
              <span>{themeOption.label}</span>
              {theme === themeOption.value && <span className="check-mark">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThemeToggle;
