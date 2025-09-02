import React, { useState } from 'react';
import { Client } from '../../types';

interface SettingsViewProps {
  client: Client;
  onUpdatePassword: (clientId: string, oldPass: string, newPass: string) => Promise<void>;
}

const SettingsView: React.FC<SettingsViewProps> = ({ client, onUpdatePassword }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
        setError("Password must be at least 6 characters long.");
        return;
    }

    setLoading(true);
    try {
      await onUpdatePassword(client.id, currentPassword, newPassword);
      setSuccess('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.message || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
        <div className="bg-card-dark rounded-xl p-8 border border-border-dark shadow-sm">
            <h3 className="text-xl font-bold text-text-light-major mb-1">Change Password</h3>
            <p className="text-text-light-minor mb-6">Update the password for your account.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-text-light-minor mb-1">Current Password</label>
                    <input 
                        type="password" 
                        value={currentPassword} 
                        onChange={(e) => setCurrentPassword(e.target.value)} 
                        className="w-full px-3 py-2 bg-bg-dark border border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                    />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-text-light-minor mb-1">New Password</label>
                    <input 
                        type="password" 
                        value={newPassword} 
                        onChange={(e) => setNewPassword(e.target.value)} 
                        className="w-full px-3 py-2 bg-bg-dark border border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                    />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-text-light-minor mb-1">Confirm New Password</label>
                    <input 
                        type="password" 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        className="w-full px-3 py-2 bg-bg-dark border border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                    />
                </div>

                {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
                {success && <p className="text-green-400 text-sm mt-2">{success}</p>}
                
                <div className="pt-4">
                    <button 
                        type="submit" 
                        disabled={loading} 
                        className="w-full bg-primary text-text-on-primary py-2.5 px-4 rounded-lg hover:bg-secondary disabled:bg-slate-400"
                    >
                        {loading ? 'Saving...' : 'Update Password'}
                    </button>
                </div>
            </form>
        </div>
    </div>
  );
};

export default SettingsView;