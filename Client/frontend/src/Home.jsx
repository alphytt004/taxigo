
import React from "react";

const Home = () => {
  const styles = {
    container: {
      fontFamily: "Arial, sans-serif",
      margin: 0,
      padding: 0,
    },
    header: {
      backgroundImage:
        'url("https://images.pexels.com/photos/1115207/pexels-photo-1115207.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")',
      backgroundSize: "cover",
      backgroundPosition: "center",
      color: "white",
      padding: "80px 20px",
      textAlign: "center",
      position: "relative",
    },
    overlay: {
      maxWidth: "1200px",
      margin: "0 auto",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      padding: "20px",
      borderRadius: "10px",
    },
    heading: {
      fontSize: "48px",
      margin: "0 0 10px",
      color: "white",
    },
    subHeading: {
      fontSize: "20px",
      margin: "10px 0 30px",
      color: "white",
      textAlign: "center",
    },
    authLinks: {
      marginTop: "20px",
      display: "flex",
      gap: "10px",
      justifyContent: "center",
    },
    authButton: {
      padding: "10px 15px",
      backgroundColor: "#28A745",
      color: "white",
      textDecoration: "none",
      fontSize: "16px",
      borderRadius: "5px",
      transition: "background-color 0.3s",
      border: "1px solid #1e7e34",
    },
    section: {
      padding: "50px 20px",
      textAlign: "center",
    },
    howItWorks: {
      padding: "50px 20px",
      textAlign: "center",
      backgroundImage:
        'url("https://images.pexels.com/photos/1521580/pexels-photo-1521580.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")', // Replace with your preferred subtle image
      backgroundSize: "cover",
      backgroundPosition: "center",
      color: "white",
      position: "relative",
    },
    howItWorksOverlay: {
      backgroundColor: "rgba(0, 0, 0, 0.6)", // Light overlay for readability
      padding: "40px",
      borderRadius: "10px",
      display: "inline-block",
    },
    services: {
      display: "flex",
      justifyContent: "center",
      gap: "20px",
      flexWrap: "wrap",
    },
    serviceBox: {
      backgroundColor: "#f8f8f8",
      padding: "20px",
      borderRadius: "10px",
      width: "300px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
    reviews: {
      backgroundColor: "#f1f1f1",
      padding: "50px 20px",
      textAlign: "center",
    },
    reviewBox: {
      backgroundColor: "white",
      padding: "20px",
      margin: "10px auto",
      maxWidth: "600px",
      borderRadius: "10px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
    cta: {
      backgroundColor: "#f1c40f",
      padding: "40px 20px",
      textAlign: "center",
      color: "black",
    },
    footer: {
      backgroundColor: "#2C3E50",
      color: "white",
      textAlign: "center",
      padding: "20px",
    },
  };

  return (
    <div style={styles.container}>
      {/* Header Section */}
      <header style={styles.header}>
        <div style={styles.overlay}>
          <h1 style={styles.heading}>Welcome to TaxiGo</h1>
          <p style={styles.subHeading}>
            Fast, reliable, and affordable taxi services at your fingertips.
          </p>
          <div style={styles.authLinks}>
            <a href="/login" style={styles.authButton}>
              Login
            </a>
            <a href="/signup" style={styles.authButton}>
              Sign Up
            </a>
          </div>
        </div>
      </header>

      {/* Services Section */}
      <section style={styles.section}>
        <h2>Our Services</h2>
        <div style={styles.services}>
          <div style={styles.serviceBox}>
            <h3>Standard Ride</h3>
            <p>Affordable and convenient city rides.</p>
          </div>
          <div style={styles.serviceBox}>
            <h3>Premium Ride</h3>
            <p>Luxury rides for a comfortable experience.</p>
          </div>
          <div style={styles.serviceBox}>
            <h3>Airport Transfer</h3>
            <p>Hassle-free rides to and from the airport.</p>
          </div>
        </div>
      </section>

      {/* How It Works Section with Background */}
      <section style={styles.howItWorks}>
        <div style={styles.howItWorksOverlay}>
          <h2>How It Works</h2>
          <p>1️⃣ Sign up and log in to your account.</p>
          <p>2️⃣ Enter your pickup and drop-off locations.</p>
          <p>3️⃣ Choose your ride type and confirm the booking.</p>
          <p>4️⃣ Enjoy your ride with a professional driver!</p>
        </div>
      </section>

      {/* Customer Reviews */}
      <section style={styles.reviews}>
        <h2>What Our Customers Say</h2>
        <div style={styles.reviewBox}>
          <p>
            "TaxiGo made my daily commute so much easier! The drivers are
            professional and always on time."
          </p>
          <strong>- Sarah L.</strong>
        </div>
        <div style={styles.reviewBox}>
          <p>
            "I love the premium ride option! It’s so comfortable, and the
            service is top-notch."
          </p>
          <strong>- James M.</strong>
        </div>
      </section>

      {/* Call to Action */}
      <section style={styles.cta}>
        <h2>Ready to Ride?</h2>
        <p>Book your first ride today and experience the best taxi service.</p>
        <a href="/signup" style={{ ...styles.authButton, backgroundColor: "black", border: "none" }}>
          Get Started
        </a>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <p>© 2025 TaxiGo. All rights reserved.</p>
        <p>
          <a href="/terms" style={{ color: "white", textDecoration: "none" }}>
            Terms & Conditions
          </a>{" "}
          |{" "}
          <a href="/privacy" style={{ color: "white", textDecoration: "none" }}>
            Privacy Policy
          </a>
        </p>
      </footer>
    </div>
  );
};

export default Home;
