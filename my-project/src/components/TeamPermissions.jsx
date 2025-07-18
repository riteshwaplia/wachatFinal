import React, { useState } from 'react';
import ToggleSwitch from '../components/ToggleSwitch';
 
const data = [
  {
    heading: 'Administrative',
    content: 'Allow/Deny permissions like Configuration, Subscription, Team Members etc',
  },
  {
    heading: 'Manage Contacts',
    content: 'Allow/Deny access for Manage Contacts, Groups, Custom Contact Fields etc',
  },
  {
    heading: 'Manage Campaigns',
    content: 'Allow/Deny access like Creating, Executing and Scheduling Campaigns etc',
  },
  {
    heading: 'Messaging',
    content: 'Allow/Deny access like Chat, Sync Templates etc',
  },
  {
    heading: 'Manage Templates',
    content: 'Allow/Deny access like Creating, Editing and Deleting Templates etc',
  },
  {
    heading: 'Assigned Chat Only',
    content: 'Restrict users to assigned chat only, unless they will have access to all chats',
  },
  {
    heading: 'Manage Bot Replies and Flows',
    content: 'Allow/Deny access for Bot Replies and Flows',
  },
];
 
export default function TeamPermissions() {
  const [toggles, setToggles] = useState(Array(data.length).fill(false));
 
  const handleToggle = (index) => {
    const updatedToggles = [...toggles];
    updatedToggles[index] = !updatedToggles[index];
    setToggles(updatedToggles);
  };
 
  return (
    <div className="space-y-4">
      {data.map((item, index) => (
        <div key={index} className="border-b pb-3 border-dashed border-primary">
          <div className="flex gap-4 items-center">
            <ToggleSwitch
              checked={toggles[index]}
              onChange={() => handleToggle(index)}
            />
            <div>{item.heading}</div>
          </div>
          <div className="text-sm text-gray-600">{item.content}</div>
        </div>
      ))}
    </div>
  );
}
 