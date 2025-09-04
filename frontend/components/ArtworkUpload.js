import { useState } from 'react';
import axios from 'axios';

export default function ArtworkUpload({ artistId, onUploadSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    copiesAvailable: ''
  });
  const [artworkImage, setArtworkImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setArtworkImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const submitData = new FormData();
      submitData.append('artistId', artistId);
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });
      
      if (artworkImage) {
        submitData.append('artworkImage', artworkImage);
      } else {
        setMessage('Please select an artwork image');
        setLoading(false);
        return;
      }

      const response = await axios.post('http://localhost:5000/api/artworks/upload', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage('Artwork uploaded successfully!');
      setFormData({
        title: '',
        description: '',
        copiesAvailable: ''
      });
      setArtworkImage(null);
      
      if (onUploadSuccess) {
        onUploadSuccess(response.data.artwork);
      }
    } catch (error) {
      setMessage(error.response?.data?.error || 'Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6 text-gambian-blue">Upload Artwork</h2>
      
      {message && (
        <div className={`mb-4 p-3 rounded-md ${
          message.includes('successfully') 
            ? 'bg-green-100 text-green-700 border border-green-300' 
            : 'bg-red-100 text-red-700 border border-red-300'
        }`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="form-label">Artwork Image *</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="form-input"
            required
          />
        </div>

        <div>
          <label className="form-label">Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="form-input"
            required
          />
        </div>

        <div>
          <label className="form-label">Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="form-input"
            rows="4"
            required
          />
        </div>

        <div>
          <label className="form-label">Number of Copies Available *</label>
          <input
            type="number"
            name="copiesAvailable"
            value={formData.copiesAvailable}
            onChange={handleInputChange}
            className="form-input"
            min="0"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full btn-secondary ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Uploading...' : 'Upload Artwork'}
        </button>
      </form>
    </div>
  );
}