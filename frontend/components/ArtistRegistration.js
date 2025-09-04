import { useState } from 'react';
import axios from 'axios';

export default function ArtistRegistration({ onRegistrationSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    address: '',
  });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setProfilePhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });
      
      if (profilePhoto) {
        submitData.append('profilePhoto', profilePhoto);
      }

      const response = await axios.post('http://localhost:5000/api/artists/register', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage('Registration successful!');
      setFormData({
        name: '',
        surname: '',
        email: '',
        address: '',
      });
      setProfilePhoto(null);
      
      if (onRegistrationSuccess) {
        onRegistrationSuccess(response.data.artist);
      }
    } catch (error) {
      setMessage(error.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6 text-gambian-red">Artist Registration</h2>
      
      {message && (
        <div className={`mb-4 p-3 rounded-md ${
          message.includes('successful') 
            ? 'bg-green-100 text-green-700 border border-green-300' 
            : 'bg-red-100 text-red-700 border border-red-300'
        }`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="form-label">Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="form-input"
            required
          />
        </div>

        <div>
          <label className="form-label">Surname *</label>
          <input
            type="text"
            name="surname"
            value={formData.surname}
            onChange={handleInputChange}
            className="form-input"
            required
          />
        </div>

        <div>
          <label className="form-label">Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="form-input"
            required
          />
        </div>

        <div>
          <label className="form-label">Address *</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="form-input"
            rows="3"
            required
          />
        </div>

        <div>
          <label className="form-label">Profile Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="form-input"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full btn-primary ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
}