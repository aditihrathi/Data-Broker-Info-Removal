import React, { useState } from 'react';
import { useRemovalRequest } from '../hooks/useRemovalRequest';

export function RemovalRequestForm() {
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        address: '',  // optional
        city: '',     // optional
        state: '',    // optional
        zip_code: ''  // optional
    });

    const { submitRequest, isLoading, error, success } = useRemovalRequest();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await submitRequest(formData);
            if (success) {
                setFormData({
                    full_name: '',
                    email: '',
                    address: '',
                    city: '',
                    state: '',
                    zip_code: ''
                });
            }
        } catch (err) {
            console.error('Form submission error:', err);
        }
    };

    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-6">Data Broker Removal Request</h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
              {/* Required fields */}
              <div>
                  <label className="block text-sm font-medium mb-1">
                      Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
              </div>

              <div>
                  <label className="block text-sm font-medium mb-1">
                      Email <span className="text-red-500">*</span>
                  </label>
                  <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
              </div>

              {/* Optional fields */}
              <div className="mt-8">
                  <h2 className="text-lg font-medium mb-4">Additional Information (Optional)</h2>
                  
                  <div className="space-y-4">
                      <div>
                          <label className="block text-sm font-medium mb-1">
                              Street Address
                          </label>
                          <input
                              type="text"
                              name="address"
                              value={formData.address}
                              onChange={handleChange}
                              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-sm font-medium mb-1">
                                  City
                              </label>
                              <input
                                  type="text"
                                  name="city"
                                  value={formData.city}
                                  onChange={handleChange}
                                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                          </div>

                          <div>
                              <label className="block text-sm font-medium mb-1">
                                  State
                              </label>
                              <input
                                  type="text"
                                  name="state"
                                  value={formData.state}
                                  onChange={handleChange}
                                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                          </div>
                      </div>

                      <div>
                          <label className="block text-sm font-medium mb-1">
                              ZIP Code
                          </label>
                          <input
                              type="text"
                              name="zip_code"
                              value={formData.zip_code}
                              onChange={handleChange}
                              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                      </div>
                  </div>
              </div>

              <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:bg-blue-300 mt-8"
              >
                  {isLoading ? 'Sending...' : 'Send Removal Requests'}
              </button>

                {error && (
                    <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mt-4 p-4 bg-green-50 text-green-600 rounded-lg">
                        Your removal requests have been sent successfully! Check your email for copies of the requests.
                    </div>
                )}
            </form>
        </div>
    );
}