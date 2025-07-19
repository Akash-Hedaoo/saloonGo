import React, { useState } from 'react';
import '../styles/ShopRegistration.css';

const ShopRegistration = () => {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    salonName: '',
    salonAddress: '',
    phoneNumber: '',
    servicesOffered: '',
    openHours: '',
    locationLat: '',
    locationLng: '',
    profileImage: null,
    role: 'salonOwner',
  });

  const handleChange = e => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    // TODO: Add registration logic
    alert('Shop registration submitted!');
  };

  return (
    <div className="shopreg-root">
      <div className="shopreg-container">
        <h1 className="shopreg-heading">Register Your Salon</h1>
        <form className="shopreg-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="fullName"
            placeholder="Owner's Full Name"
            value={form.fullName}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password (min 6 chars)"
            value={form.password}
            onChange={handleChange}
            minLength={6}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="salonName"
            placeholder="Salon Name"
            value={form.salonName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="salonAddress"
            placeholder="Salon Address"
            value={form.salonAddress}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="phoneNumber"
            placeholder="Phone Number (with country code)"
            value={form.phoneNumber}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="servicesOffered"
            placeholder="Services Offered (comma separated)"
            value={form.servicesOffered}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="openHours"
            placeholder="Open Hours (e.g., 10AM–8PM)"
            value={form.openHours}
            onChange={handleChange}
          />
          <div className="shopreg-location-fields">
            <input
              type="text"
              name="locationLat"
              placeholder="Latitude"
              value={form.locationLat}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="locationLng"
              placeholder="Longitude"
              value={form.locationLng}
              onChange={handleChange}
              required
            />
          </div>
          <input
            type="hidden"
            name="role"
            value="salonOwner"
            readOnly
          />
          <label className="shopreg-file-label">
            Profile Image (optional)
            <input
              type="file"
              name="profileImage"
              accept="image/*"
              onChange={handleChange}
              id="shopreg-profile-image"
            />
            <span
              className="shopreg-file-custom"
              onClick={() => document.getElementById('shopreg-profile-image').click()}
              tabIndex={0}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') document.getElementById('shopreg-profile-image').click(); }}
            >
              Choose File
            </span>
            {form.profileImage && (
              <span style={{ marginTop: '0.3rem', color: '#3b82f6', fontSize: '0.95rem' }}>{form.profileImage.name}</span>
            )}
          </label>
          <button className="shopreg-btn" type="submit">Register Shop</button>
        </form>
        <div className="shopreg-login-link">
          Already registered? <a href="/login">Login here</a>
        </div>
      </div>
    </div>
  );
};

export default ShopRegistration; 