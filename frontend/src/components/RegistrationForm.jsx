import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function RegistrationForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    interests: [],
  });

  const [formErrors, setFormErrors] = useState({});
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => {
      const newInterests = checked
        ? [...prev.interests, name]
        : prev.interests.filter((interest) => interest !== name);
      return { ...prev, interests: newInterests };
    });
  };

  const validateForm = () => {
    let errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      errors.email = 'Invalid email format';
    }
    if (!formData.phone.match(/^\d{10}$/)) {
      errors.phone = 'Phone number must be exactly 10 digits';
    }
    if (formData.interests.length === 0) {
      errors.interests = 'At least one interest must be selected';
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length === 0) {
      try {
        await axios.post('http://funlearn.kshitiksha.xyz/registration', formData);
        setShowModal(true);
      } catch (error) {
        console.error('Registration Failed', error.response ? error.response.data : 'Server error');
        setFormErrors({ form: 'Failed to submit registration.' });
      }
    } else {
      setFormErrors(errors);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate('/start');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-cyan-300 via-cyan-100 to-cyan-50">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md mt-16 mb-8">
        {showModal && (
          <Modal
            message="Thank you for registering! Our team will contact you soon."
            onClose={handleCloseModal}
          />
        )}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-purple-800 my-4 mb-2 uppercase">
            FUNLEARN REGISTRATION FORM
          </h1>
          <p className="text-rose-600 uppercase mt-4 mb-8 font-semibold">
            KSHITIKSHA FOUNDATION 📚
          </p>
          <p className="text-gray-600 mt-2 mb-4 font-normal text-sm">
            "The journey of a thousand miles begins with one step. Embrace the adventure of learning with us at FUNLEARN by Kshitiksha Foundation."
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            name="name"
            label="Name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            error={formErrors.name}
          />
          <InputField
            name="email"
            label="E-Mail"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            error={formErrors.email}
          />
          <InputField
            name="phone"
            label="Mobile Number"
            placeholder="Enter your mobile number"
            value={formData.phone}
            onChange={handleChange}
            error={formErrors.phone}
          />

          <label className="text-gray-700 font-medium mt-6">
            Interested in:
          </label>
          <div className="space-y-2">
            {[
              "Website Designing",
              "French Learning",
              "German Learning",
              "Korean Learning",
              "Spanish Learning",
              "English Communication Classes",
            ].map((interest) => (
              <label key={interest} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name={interest}
                  checked={formData.interests.includes(interest)}
                  onChange={handleCheckboxChange}
                />
                <span>{interest}</span>
              </label>
            ))}
          </div>

          {formErrors.interests && (
            <p className="text-red-600">{formErrors.interests}</p>
          )}

          <button
            type="submit"
            className="btn bg-purple-700 hover:bg-purple-800 w-full rounded-full text-white py-2"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

function InputField({ name, label, placeholder, value, onChange, error }) {
  return (
    <div>
      <label className="text-gray-700 font-medium">{label}</label>
      <input
        type="text"
        name={name}
        placeholder={placeholder}
        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg p-2.5"
        value={value}
        onChange={onChange}
        required
      />
      {error && (
        <p className="text-red-600 mt-1">{error} <span className="text-xl">❗</span></p>
      )}
    </div>
  );
}

function Modal({ message, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="text-center text-lg font-semibold mb-2 text-cyan-600">
          Submission Confirmation
        </h2>
        <p>{message}</p>
        <button onClick={onClose} className="close-btn">
          Close
        </button>
      </div>
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: rgba(0, 0, 0, 0.6);
          z-index: 1000;
        }
        .modal-content {
          padding: 20px;
          background: white;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          text-align: center;
          width: 300px;
        }
        .close-btn {
          display: inline-block;
          padding: 8px 15px;
          margin-top: 15px;
          font-size: 16px;
          color: white;
          background-color: #007bff;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        .close-btn:hover {
          background-color: #0056b3;
        }
      `}</style>
    </div>
  );
}

export default RegistrationForm;