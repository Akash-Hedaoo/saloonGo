import React from 'react';
import '../styles/UserProfile.css';


const UserProfile = () => {
  const user = {
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Customer',
    avatar: 'https://i.pravatar.cc/150?img=3',
    phone: '+91-9876543210',
    address: '123 Main Street, City, Country',
  };

  return (
    <div className="user-profile-container">
      <div className="user-profile-card">
        <div className="user-profile-header">
          <img src={user.avatar} alt="User Avatar" className="user-avatar" />
          <div>
            <h2>{user.name}</h2>
            <p>{user.role}</p>
          </div>
        </div>

        <div className="user-details">
          <h3>Contact Information</h3>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone:</strong> {user.phone}</p>
          <p><strong>Address:</strong> {user.address}</p>
        </div>

        <div className="user-profile-actions">
          <button className="edit-button">Edit</button>
          <button className="logout-button">Logout</button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
