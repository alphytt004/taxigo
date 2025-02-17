import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [hoveredLink, setHoveredLink] = useState(null);
  const location = useLocation();



  return (
    <div style={styles.container}>
      <nav style={styles.navbar}>
        <div style={styles.navbarBrand}>
          <h2 style={styles.brandTitle}>TaxiGo</h2>
        </div>
        {!localStorage.getItem('token') && (
          <ul style={styles.navbarLinks}>
            {['home', 'Signup', 'login'].map((link) => (
              <li
                key={link}
                style={styles.navItem}
                onMouseEnter={() => setHoveredLink(link)}
                onMouseLeave={() => setHoveredLink(null)}
              >
                <Link
                  to={`/${link.charAt(0).toUpperCase() + link.slice(1)}`}
                  style={{
                    ...styles.navLink,
                    backgroundColor: hoveredLink === link ? '#ffffff' : 'transparent',
                    transform: hoveredLink === link ? 'scale(1.1)' : 'none',
                    color: hoveredLink === link ? '#f1c40f' : '#ffffff',
                  }}
                >
                  {link.charAt(0).toUpperCase() + link.slice(1)}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </nav>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    margin: 0,
    padding: 0,
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 30px',
    background: 'linear-gradient(90deg, #f39c12, #f1c40f)',
    color: 'black',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  navbarBrand: {
    margin: 0,
  },
  brandTitle: {
    margin: 0,
    fontSize: '28px',
    fontWeight: '700',
    letterSpacing: '1.5px',
    color: '#ffffff',
    textShadow: '1px 1px 4px rgba(0, 0, 0, 0.2)',
  },
  navbarLinks: {
    listStyleType: 'none',
    margin: 0,
    padding: 0,
    display: 'flex',
    alignItems: 'center',
  },
  navItem: {
    margin: '0 15px',
    transition: 'all 0.3s ease',
  },
  navLink: {
    color: '#ffffff',
    textDecoration: 'none',
    fontSize: '18px',
    fontWeight: '500',
    padding: '10px 15px',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
};

export default Navbar;
