import React, { useState } from 'react';

const ProfileFetcher = () => {
  const [inputValue, setInputValue] = useState('');
  const [profileData, setProfileData] = useState(null);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const fetchProfileDetails = async () => {
    try {
      const apiUrl = `https://api.web3.bio/profile/${inputValue}`;
      const response = await fetch(apiUrl);
      const data = await response.json();
      setProfileData(data);
    } catch (error) {
      console.error('Error fetching profile details:', error);
    }
  };

  const styles = {
    container: {
      maxWidth: '800px',
      margin: 'auto',
      padding: '20px',
      textAlign: 'center',
      backgroundColor: '#f9f9f9',
      color: '#333',
    },
    heading: {
      fontSize: '24px',
      marginBottom: '20px',
    },
    label: {
      display: 'block',
      marginBottom: '10px',
    },
    input: {
      width: '100%',
      padding: '8px',
      fontSize: '16px',
    },
    button: {
      padding: '10px',
      fontSize: '16px',
      cursor: 'pointer',
      backgroundColor: '#4CAF50',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
    },
    detailsContainer: {
      marginTop: '30px',
      textAlign: 'left',
    },
    detailsHeading: {
      fontSize: '20px',
      marginBottom: '10px',
    },
    details: {
      padding: '10px',
      backgroundColor: '#f5f5f5',
      borderRadius: '4px',
      overflowX: 'auto',
      color: '#333',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Profile Details Lookup</h1>
      <label style={styles.label}>
        Enter Address or ENS:
        <input type="text" value={inputValue} onChange={handleInputChange} style={styles.input} />
      </label>
      <button onClick={fetchProfileDetails} style={styles.button}>
        Fetch Details
      </button>

      {profileData && (
        <div style={styles.detailsContainer}>
          <h2 style={styles.detailsHeading}>ENS Details</h2>
          <pre style={styles.details}>{JSON.stringify(profileData.filter(user => user.platform === 'ENS'), null, 2)}</pre>

          <h2 style={styles.detailsHeading}>Lens Details</h2>
          <pre style={styles.details}>{JSON.stringify(profileData.filter(user => user.platform === 'lens'), null, 2)}</pre>

          {/* Add more sections for different platforms as needed */}
        </div>
      )}
    </div>
  );
};

export default ProfileFetcher;
