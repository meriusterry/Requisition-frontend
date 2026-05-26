import React, { useState } from 'react';
import { FiSave, FiGlobe, FiBell, FiDollarSign } from 'react-icons/fi';
import toast from 'react-hot-toast';

const SystemPreferences: React.FC = () => {
  const [settings, setSettings] = useState({
    companyName: 'Acme Corporation',
    companyEmail: 'admin@acme.com',
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    notificationEnabled: true,
    autoApproveLimit: 500,
    requireApproval: true,
    enableAuditLog: true,
    maintenanceMode: false,
  });

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Settings saved successfully!');
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      {/* General Settings */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <FiGlobe className="h-5 w-5 mr-2 text-blue-600" />
          General Settings
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Name
            </label>
            <input
              type="text"
              value={settings.companyName}
              onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Email
            </label>
            <input
              type="email"
              value={settings.companyEmail}
              onChange={(e) => setSettings({ ...settings, companyEmail: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Timezone
            </label>
            <select
              value={settings.timezone}
              onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>America/New_York</option>
              <option>America/Chicago</option>
              <option>America/Denver</option>
              <option>America/Los_Angeles</option>
              <option>Europe/London</option>
              <option>Asia/Tokyo</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Format
            </label>
            <select
              value={settings.dateFormat}
              onChange={(e) => setSettings({ ...settings, dateFormat: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>MM/DD/YYYY</option>
              <option>DD/MM/YYYY</option>
              <option>YYYY-MM-DD</option>
            </select>
          </div>
        </div>
      </div>

      {/* Approval Settings */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <FiDollarSign className="h-5 w-5 mr-2 text-green-600" />
          Approval Settings
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800">Auto-approval Limit</p>
              <p className="text-sm text-gray-500">Requests under this amount are auto-approved</p>
            </div>
            <input
              type="number"
              value={settings.autoApproveLimit}
              onChange={(e) => setSettings({ ...settings, autoApproveLimit: parseInt(e.target.value) })}
              className="w-32 px-3 py-2 border border-gray-300 rounded-lg text-right"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800">Require Manager Approval</p>
              <p className="text-sm text-gray-500">All requests need manager approval</p>
            </div>
            <button
              onClick={() => setSettings({ ...settings, requireApproval: !settings.requireApproval })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                settings.requireApproval ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  settings.requireApproval ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <FiBell className="h-5 w-5 mr-2 text-yellow-600" />
          Notification Settings
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800">Email Notifications</p>
              <p className="text-sm text-gray-500">Receive email updates for requisitions</p>
            </div>
            <button
              onClick={() => setSettings({ ...settings, notificationEnabled: !settings.notificationEnabled })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                settings.notificationEnabled ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  settings.notificationEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800">Audit Logging</p>
              <p className="text-sm text-gray-500">Track all system activities</p>
            </div>
            <button
              onClick={() => setSettings({ ...settings, enableAuditLog: !settings.enableAuditLog })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                settings.enableAuditLog ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  settings.enableAuditLog ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2 disabled:opacity-50"
        >
          <FiSave className="h-4 w-4" />
          <span>{saving ? 'Saving...' : 'Save All Settings'}</span>
        </button>
      </div>
    </div>
  );
};

export default SystemPreferences;