// src/App.jsx
import React, { useState } from 'react';
import './index.css';

// Import all your components
import Button from './components/Button';
import InputField from './components/InputField';
import TextArea from './components/TextArea';
import Checkbox from './components/Checkbox';
import RadioButton from './components/RadioButton';
import ToggleSwitch from './components/ToggleSwitch';
import SelectField from './components/SelectField';
import Card from './components/Card';
import Alert from './components/Alert';
import Avatar from './components/Avatar';    // NEW
import Badge from './components/Badge';      // NEW
import Loader from './components/Loader';    // NEW
import Navbar from './components/Navbar';    // NEW
import Modal from './components/Modal';      // NEW


function AllComponents() {
  // InputField states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hasEmailError, setHasEmailError] = useState(false);
  const [searchText, setSearchText] = useState('');

  // TextArea state
  const [description, setDescription] = useState('');

  // Checkbox states
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // RadioButton state
  const [selectedOption, setSelectedOption] = useState('option1');

  // ToggleSwitch state
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  // SelectField state
  const [selectedCity, setSelectedCity] = useState('');
  const cityOptions = [
    { value: '', label: 'Select a City' },
    { value: 'newyork', label: 'New York' },
    { value: 'london', label: 'London' },
    { value: 'paris', label: 'Paris' },
    { value: 'tokyo', label: 'Tokyo' },
  ];

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setHasEmailError(false);
  };

  const handleSubmitForm = () => {
    if (!email.includes('@')) {
      setHasEmailError(true);
    } else {
      alert('Form Data Submitted!');
      setIsModalOpen(false); // Close modal on submit
      // In a real app, you'd send this to your backend
    }
  };

  const navLinks = [
    { href: '#home', label: 'Home' },
    { href: '#about', label: 'About' },
    { href: '#services', label: 'Services' },
    { href: '#contact', label: 'Contact' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar links={navLinks} brandName="My MERN App" />

      <div className="font-sans text-gray-800 p-8">
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary-700 text-center mb-12">
          Modern UI Components Showcase
        </h1>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {/* --- Button Showcase --- */}
          <Card title="Buttons">
            <div className="flex flex-wrap gap-4 items-center">
              <Button onClick={() => alert('Primary Clicked!')}>Primary Button</Button>
              <Button variant="secondary">Secondary Button</Button>
              <Button variant="accent">Accent Button</Button>
              <Button variant="outline">Outline Button</Button>
              <Button variant="text">Text Button</Button>
              <Button disabled>Disabled Button</Button>
              <Button size="sm">Small Button</Button>
              <Button size="lg">Large Button</Button>
            </div>
          </Card>

          {/* --- Input Field & Text Area Showcase --- */}
          <Card title="Input Fields & Text Area">
            <InputField
              id="email-input"
              label="Email Address"
              type="email"
              placeholder="your@example.com"
              value={email}
              onChange={handleEmailChange}
              error={hasEmailError}
              helperText={hasEmailError ? 'Please enter a valid email address.' : 'We\'ll never share your email.'}
            />
            <InputField
              id="password-input"
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              helperText="Minimum 8 characters"
            />
            <InputField
              id="search-input"
              label="Search"
              type="search"
              placeholder="Search anything..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <InputField
              id="number-input"
              label="Quantity"
              type="number"
              placeholder="e.g., 5"
              value={10}
              onChange={() => {}}
            />
            <TextArea
              id="description-input"
              label="Description"
              placeholder="Tell us more about your project..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              helperText="Max 500 characters"
            />
          </Card>

          {/* --- Checkbox, Radio & Toggle Showcase --- */}
          <Card title="Checkboxes, Radios & Toggles">
            <Checkbox
              id="terms-checkbox"
              label="I agree to the terms and conditions"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
            />
            <Checkbox
              id="remember-me-checkbox"
              label="Remember me"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled
            />

            <h3 className="text-lg font-semibold mb-2 mt-4">Choose an Option:</h3>
            <div className="space-y-2">
              <RadioButton
                id="radio1"
                name="myOptions"
                label="Option One"
                value="option1"
                checked={selectedOption === 'option1'}
                onChange={(e) => setSelectedOption(e.target.value)}
              />
              <RadioButton
                id="radio2"
                name="myOptions"
                label="Option Two"
                value="option2"
                checked={selectedOption === 'option2'}
                onChange={(e) => setSelectedOption(e.target.value)}
              />
              <RadioButton
                id="radio3"
                name="myOptions"
                label="Option Three (Disabled)"
                value="option3"
                checked={selectedOption === 'option3'}
                onChange={(e) => setSelectedOption(e.target.value)}
                disabled
              />
            </div>

            <h3 className="text-lg font-semibold mb-2 mt-4">Toggles:</h3>
            <ToggleSwitch
              id="notifications-toggle"
              label="Enable Notifications"
              checked={notificationsEnabled}
              onChange={() => setNotificationsEnabled(!notificationsEnabled)}
            />
            <ToggleSwitch
              id="darkmode-toggle"
              label="Dark Mode"
              checked={darkModeEnabled}
              onChange={() => setDarkModeEnabled(!darkModeEnabled)}
              disabled
            />
          </Card>

          {/* --- Select Field & Alerts --- */}
          <Card title="Select & Alerts">
            <SelectField
              id="city-select"
              label="Choose your City"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              options={cityOptions}
              helperText="Where are you located?"
            />
            <div className="space-y-4 mt-6">
              <Alert type="info" message="Welcome back! Check out our new features." />
              <Alert type="success" message="Profile updated successfully!" />
              <Alert type="warning">
                <p className="font-bold">Heads up!</p>
                <p>Your session will expire in 5 minutes.</p>
              </Alert>
              <Alert type="error" message="Error: Invalid credentials. Please try again." />
            </div>
          </Card>

          {/* --- Avatars, Badges, Loaders Showcase --- */}
          <Card title="Avatars, Badges & Loaders">
            <h3 className="text-lg font-semibold mb-2">Avatars:</h3>
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <Avatar src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Profile Picture" size="lg" />
              <Avatar src="https://images.unsplash.com/photo-1494790108377-be9c29b29329?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Jane Doe" size="md" />
              <Avatar initials="JD" alt="John Doe" size="lg" />
              <Avatar initials="AD" alt="Admin" size="sm" />
            </div>

            <h3 className="text-lg font-semibold mb-2">Badges:</h3>
            <div className="flex flex-wrap gap-2 mb-6">
              <Badge type="primary">New Feature</Badge>
              <Badge type="secondary" size="sm">Beta</Badge>
              <Badge type="accent">Premium</Badge>
              <Badge type="success">Active</Badge>
              <Badge type="warning">Pending</Badge>
              <Badge type="error">Declined</Badge>
              <Badge type="gray">Draft</Badge>
              <Badge type="primary" variant="outline">Primary Outline</Badge>
              <Badge type="success" variant="outline">Success Outline</Badge>
            </div>

            <h3 className="text-lg font-semibold mb-2">Loaders:</h3>
            <div className="flex flex-wrap items-center gap-4">
              <Loader size="sm" />
              <Loader /> {/* Default md size */}
              <Loader size="lg" color="secondary" />
              <Loader color="accent" />
              <Loader color="gray" />
            </div>
          </Card>

          {/* --- Modal Trigger --- */}
          <Card title="Modals/Dialogs">
            <p className="text-gray-700 mb-4">Click the button below to open a modal dialog.</p>
            <Button onClick={() => setIsModalOpen(true)} variant="primary">
              Open Modal
            </Button>

            <Modal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              title="Welcome to Our App"
              size="sm" // Can be 'sm', 'md', 'lg'
            >
              <p className="text-gray-700 mb-4">
                This is a fully functional modal dialog. You can put any content here,
                like forms, messages, or confirmations.
              </p>
              <p className="text-gray-600 text-sm mb-6">
                Click outside, press ESC, or use the close button to dismiss.
              </p>
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleSubmitForm}>
                  Confirm
                </Button>
              </div>
            </Modal>
          </Card>

          {/* --- Form Submission Example --- */}
          <Card title="Combined Form Example" className="md:col-span-2 lg:col-span-3">
            <p className="text-gray-700 mb-6">
              This card demonstrates how multiple components can be combined into a form.
            </p>
            <div className="flex justify-end">
              <Button onClick={handleSubmitForm} variant="primary" size="lg">
                Submit All Data
              </Button>
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
}

export default AllComponents;