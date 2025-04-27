import React, { useState } from 'react';
import {
  User,
  Bell,
  Lock,
  HardDrive,
  Share2,
  Palette,
  Languages,
  HelpCircle,
  ChevronRight,
  Shield,
  Download,
  Trash2,
  Users,
  Clock,
  Mail
} from 'lucide-react';
import { Link } from 'react-router-dom';

const SettingsSection = ({ title, children }) => (
  <div className="mb-8">
    <h3 className="text-lg font-medium mb-4">{title}</h3>
    <div className="bg-white rounded-lg shadow divide-y divide-gray-200">
      {children}
    </div>
  </div>
);

const SettingsItem = ({ icon, title, description, action }) => (
  <div className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer">
    <div className="flex items-center space-x-4">
      <div className="flex-shrink-0 text-gray-500">{icon}</div>
      <div>
        <h4 className="font-medium text-gray-900">{title}</h4>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </div>
    </div>
    <div className="flex items-center">
      {action}
      <ChevronRight className="w-5 h-5 text-gray-400 ml-2" />
    </div>
  </div>
);

const Badge = ({ children, color = "blue" }) => (
  <span className={`text-xs font-medium px-2 py-1 rounded-full bg-${color}-100 text-${color}-800`}>
    {children}
  </span>
);

const Settings = () => {
  const [language, setLanguage] = useState("English");
  const [theme, setTheme] = useState("Light");

  const languages = ["English", "Spanish", "French", "German", "Japanese", "Chinese", "Portuguese"];
  const themes = ["Light", "System Default"];

  // Handler functions for button clicks
  const handleNotificationsClick = () => {
    alert("Opening notifications configuration");
    // Here you would typically navigate to notifications page or open a modal
  };

  const handleSecurityClick = () => {
    alert("Opening security settings");
    // Here you would typically navigate to security page or open a modal
  };

  const handlePrivacyClick = () => {
    alert("Opening privacy settings");
    // Here you would typically navigate to privacy page or open a modal
  };

  const handleSharingClick = () => {
    alert("Opening sharing preferences");
    // Here you would typically navigate to sharing page or open a modal
  };

  const handleDataDownloadClick = () => {
    alert("Preparing data download");
    // Here you would trigger the data download process
  };

  const handleDataManagementClick = () => {
    alert("Opening data management options");
    // Here you would navigate to data management page or open a modal
  };

  const handleHelpCenterClick = () => {
    alert("Navigating to Help Center");
    // Here you would navigate to the help center
  };

  const handleSupportClick = () => {
    alert("Opening support contact form");
    // Here you would open a contact form or navigate to support page
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all settings to default?")) {
      setLanguage("English");
      setTheme("Light");
      alert("Settings have been reset to defaults");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <button
          onClick={handleReset}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          Reset to defaults
        </button>
      </div>

      <SettingsSection title="Account">
        <SettingsItem
          icon={<User className="w-5 h-5" />}
          title="Profile Information"
          description="Update your personal information and email"
          action={<Link to="/profile" className="text-blue-600 hover:text-blue-800 font-medium">Edit</Link>}
        />
        <SettingsItem
          icon={<Mail className="w-5 h-5" />}
          title="Email Preferences"
          description="Manage your email notifications and updates"
          action={
            <button className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
              <Badge color="green">Updated</Badge>
            </button>
          }
        />
        <SettingsItem
          icon={<Bell className="w-5 h-5" />}
          title="Notifications"
          description="Choose what notifications you want to receive"
          action={
            <button
              onClick={handleNotificationsClick}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Configure
            </button>
          }
        />
        <SettingsItem
          icon={<Lock className="w-5 h-5" />}
          title="Security"
          description="Manage your password and 2FA settings"
          action={
            <button
              onClick={handleSecurityClick}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Manage
            </button>
          }
        />
        <SettingsItem
          icon={<Shield className="w-5 h-5" />}
          title="Privacy"
          description="Control your data and privacy options"
          action={
            <button
              onClick={handlePrivacyClick}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Review
            </button>
          }
        />
        <SettingsItem
          icon={<Clock className="w-5 h-5" />}
          title="Session Management"
          description="Manage active sessions and devices"
          action={<Badge>3 active</Badge>}
        />
      </SettingsSection>

      <SettingsSection title="Storage">
        <SettingsItem
          icon={<HardDrive className="w-5 h-5" />}
          title="Storage Usage"
          description="2GB of 5GB used"
          action={
            <div className="flex items-center">
              <div className="w-32 h-2 bg-gray-200 rounded-full mr-3">
                <div className="w-2/5 h-2 bg-blue-600 rounded-full"></div>
              </div>
              <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors">
                Upgrade
              </button>
            </div>
          }
        />
        <SettingsItem
          icon={<Share2 className="w-5 h-5" />}
          title="Sharing Preferences"
          description="Manage default sharing settings"
          action={
            <button
              onClick={handleSharingClick}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Configure
            </button>
          }
        />
        <SettingsItem
          icon={<Download className="w-5 h-5" />}
          title="Download Data"
          description="Download a copy of your stored data"
          action={
            <button
              onClick={handleDataDownloadClick}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Download
            </button>
          }
        />
        <SettingsItem
          icon={<Trash2 className="w-5 h-5" />}
          title="Data Management"
          description="Clean up or delete your stored data"
          action={
            <button
              onClick={handleDataManagementClick}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Manage
            </button>
          }
        />
        <SettingsItem
          icon={<Users className="w-5 h-5" />}
          title="Team Access"
          description="Manage who can access your data"
          action={<Badge>2 members</Badge>}
        />
      </SettingsSection>

      <SettingsSection title="Appearance">
        <SettingsItem
          icon={<Palette className="w-5 h-5" />}
          title="Theme"
          description="Choose your preferred theme"
          action={
            <select
              className="border rounded px-3 py-1 bg-white"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
            >
              {themes.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          }
        />
        <SettingsItem
          icon={<Languages className="w-5 h-5" />}
          title="Language"
          description="Choose your preferred language"
          action={
            <select
              className="border rounded px-3 py-1 bg-white"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              {languages.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          }
        />
      </SettingsSection>

      <SettingsSection title="Help & Support">
        <SettingsItem
          icon={<HelpCircle className="w-5 h-5" />}
          title="Help Center"
          description="Browse FAQs and help articles"
          action={
            <button
              onClick={handleHelpCenterClick}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Visit
            </button>
          }
        />
        <SettingsItem
          icon={<Mail className="w-5 h-5" />}
          title="Contact Support"
          description="Get assistance from our support team"
          action={
            <button
              onClick={handleSupportClick}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Contact
            </button>
          }
        />
      </SettingsSection>
    </div>
  );
};

export default Settings;
