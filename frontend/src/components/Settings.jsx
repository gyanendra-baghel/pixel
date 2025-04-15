import React from 'react';
import { 
  User, 
  Bell, 
  Lock, 
  HardDrive, 
  Share2, 
  Palette, 
  Languages, 
  HelpCircle 
} from 'lucide-react';

const SettingsSection = ({ title, children }) => (
  <div className="mb-8">
    <h3 className="text-lg font-medium mb-4">{title}</h3>
    <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-200">
      {children}
    </div>
  </div>
);

const SettingsItem = ({ icon, title, description, action }) => (
  <div className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
    <div className="flex items-center space-x-3">
      <div className="text-gray-400">{icon}</div>
      <div>
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
    {action}
  </div>
);

const Settings = () => {
  return (
    <div className="p-6 max-w-4xl">
      <h2 className="text-2xl font-semibold mb-6">Settings</h2>

      <SettingsSection title="Account">
        <SettingsItem
          icon={<User className="w-5 h-5" />}
          title="Profile Information"
          description="Update your personal information and email"
          action={<button className="text-blue-500 hover:text-blue-600">Edit</button>}
        />
        <SettingsItem
          icon={<Bell className="w-5 h-5" />}
          title="Notifications"
          description="Choose what notifications you want to receive"
          action={<button className="text-blue-500 hover:text-blue-600">Configure</button>}
        />
        <SettingsItem
          icon={<Lock className="w-5 h-5" />}
          title="Security"
          description="Manage your password and 2FA settings"
          action={<button className="text-blue-500 hover:text-blue-600">Manage</button>}
        />
      </SettingsSection>

      <SettingsSection title="Storage">
        <SettingsItem
          icon={<HardDrive className="w-5 h-5" />}
          title="Storage Usage"
          description="2GB of 5GB used"
          action={<button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Upgrade</button>}
        />
        <SettingsItem
          icon={<Share2 className="w-5 h-5" />}
          title="Sharing Preferences"
          description="Manage default sharing settings"
          action={<button className="text-blue-500 hover:text-blue-600">Configure</button>}
        />
      </SettingsSection>

      <SettingsSection title="Appearance">
        <SettingsItem
          icon={<Palette className="w-5 h-5" />}
          title="Theme"
          description="Choose between light and dark mode"
          action={
            <select className="border rounded px-2 py-1">
              <option>Light</option>
              <option>Dark</option>
              <option>System</option>
            </select>
          }
        />
        <SettingsItem
          icon={<Languages className="w-5 h-5" />}
          title="Language"
          description="Choose your preferred language"
          action={
            <select className="border rounded px-2 py-1">
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          }
        />
      </SettingsSection>

      <SettingsSection title="Help">
        <SettingsItem
          icon={<HelpCircle className="w-5 h-5" />}
          title="Support"
          description="Get help or contact support"
          action={<button className="text-blue-500 hover:text-blue-600">Contact</button>}
        />
      </SettingsSection>
    </div>
  );
};

export default Settings;