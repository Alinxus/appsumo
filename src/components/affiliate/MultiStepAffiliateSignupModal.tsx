import React, { useState } from 'react';
import { AffiliateApplicationForm } from './AffiliateApplicationForm';

export function MultiStepAffiliateSignupModal({ onSuccess }: { onSuccess: () => void }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    website: '',
    bio: '',
    commissionRate: 10,
    socialLinks: {
      twitter: '',
      linkedin: '',
      youtube: '',
      instagram: ''
    }
  });

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = () => {
    // Pass formData to AffiliateApplicationForm for submission
    onSuccess();
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-8">
      {step === 1 && (
        <div>
          <h2 className="text-xl font-bold">Step 1: Basic Information</h2>
          <label>Website URL</label>
          <input
            type="url"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
          />
          <label>Bio</label>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          />
          <button onClick={nextStep}>Next</button>
        </div>
      )}
      {step === 2 && (
        <div>
          <h2 className="text-xl font-bold">Step 2: Commission Details</h2>
          <label>Preferred Commission Rate (%)</label>
          <select
            value={formData.commissionRate}
            onChange={(e) => setFormData({ ...formData, commissionRate: Number(e.target.value) })}
          >
            <option value={8}>8% - Standard Rate</option>
            <option value={10}>10% - Premium Rate</option>
            <option value={12}>12% - VIP Rate</option>
          </select>
          <button onClick={prevStep}>Back</button>
          <button onClick={nextStep}>Next</button>
        </div>
      )}
      {step === 3 && (
        <div>
          <h2 className="text-xl font-bold">Step 3: Social Media Profiles</h2>
          {/* Social media fields here */}
          <button onClick={prevStep}>Back</button>
          <button onClick={nextStep}>Next</button>
        </div>
      )}
      {step === 4 && (
        <div>
          <h2 className="text-xl font-bold">Review & Submit</h2>
          {/* Review form data here */}
          <button onClick={prevStep}>Back</button>
          <button onClick={handleSubmit}>Submit</button>
        </div>
      )}
    </div>
  );
}
