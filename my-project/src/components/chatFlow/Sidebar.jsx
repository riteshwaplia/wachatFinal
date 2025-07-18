import React, { useState } from 'react';
import DraggableNode from './DraggbleNode';
import { ChevronDown, ChevronUp, Clock, Copy, FileImage, FileText, Globe, Grid3X3, Hand, Image, LayoutGrid, Link, List, MessageSquare, Music, Package, PencilLine, RotateCcw, Rows, Send, Tag, UserMinus, UserPlus, Users, Video } from 'lucide-react';


const Sidebar = () => {
  const [openGroups, setOpenGroups] = useState({});

  const toggleGroup = (type) => {
    setOpenGroups((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const nodeConfigs = [
    {
      type: 'text',
      label: 'text',
      icon: MessageSquare,
      color: 'primary',
      description: 'Send text messages'
    },
    {
      type: 'audio',
      label: 'audio',
      icon: Music,
      color: 'primary',
      description: 'Send audio messages'
    },
    {
      type: 'interactiveMessage',
      label: 'Interactive',
      icon: Hand,
      isGroup: true,
      children: [
        {
          type: 'interactive_buttons',
          label: 'Button',
          icon: LayoutGrid,
        },
        {
          type: 'interactive_list_section',
          label: 'List Section',
          icon: List,
        },
        {
          type: 'interactive_list_row',
          label: 'List Row',
          icon: Rows,
        },
      ]
    },

    {
      type: 'image',
      label: 'Image',
      icon: Image,
      color: 'primary',
      description: 'Send image messages'
    },
    {
      type: 'video',
      label: 'Video',
      icon: Video,
      color: 'primary',
      description: 'Send video messages'
    },

    // Document & Interactive
    {
      type: 'documentMessage',
      label: 'Document',
      icon: FileText,
      color: 'primary',
      description: 'Send document files'
    },
    // {
    //   type: 'interactiveMessage',
    //   label: 'Interactive',
    //   icon: Hand,
    //   color: 'primary',
    //   description: 'Interactive elements'
    // },

    // Flow Control
    {
      type: 'sequence',
      label: 'Sequence',
      icon: RotateCcw,
      color: 'primary',
      description: 'Sequential flow'
    },
    {
      type: 'sequenceAfter',
      label: 'Sequence Message After',
      icon: Send,
      color: 'primary',
      description: 'Message after sequence'
    },

    // Template & Team
    {
      type: 'template',
      label: 'Template',
      icon: FileImage,
      color: 'primary',
      description: 'Message templates'
    },
    {
      type: 'addTeam',
      label: 'Add Team Member',
      icon: Users,
      color: 'primary',
      description: 'Add team members'
    },

    // Utility
    {
      type: 'timeDelay',
      label: 'Time Delay',
      icon: Clock,
      color: 'primary',
      description: 'Add time delays'
    },

    // User Management
    {
      type: 'subscribe',
      label: 'Subscribe',
      icon: UserPlus,
      color: 'primary',
      description: 'Subscribe user'
    },
    {
      type: 'unsubscribe',
      label: 'Unsubscribe',
      icon: UserMinus,
      color: 'primary',
      description: 'Unsubscribe user'
    },

    // Tags & Flow
    {
      type: 'setTags',
      label: 'Set Tags',
      icon: Tag,
      color: 'primary',
      description: 'Set user tags'
    },
    {
      type: 'invokeFlow',
      label: 'Invoke New Flow',
      icon: Copy,
      color: 'primary',
      description: 'Invoke another flow'
    },

    // API & Webhooks
    {
      type: 'httpApi',
      label: 'HTTP API',
      icon: Globe,
      color: 'primary',
      description: 'Make API calls'
    },
    {
      type: 'webhook',
      label: 'Webhook',
      icon: Link,
      color: 'primary',
      description: 'Send webhooks'
    },

    // E-commerce
    {
      type: 'sendProduct',
      label: 'Send Product',
      icon: Package,
      color: 'primary',
      description: 'Send product info'
    },
    {
      type: 'sendCatalog',
      label: 'Send Catalog',
      icon: Grid3X3,
      color: 'primary',
      description: 'Send product catalog'
    }

  ];


  return (
    <div className="bg-bg border-r border-gray-200 w-full h-full overflow-y-auto">
      <div className="p-4 grid grid-cols-2 gap-2">
        {nodeConfigs.map((config, i) => {
          if (config.isGroup) {
            const isOpen = openGroups[config.type];
            return (

              <div key={i} className="col-span-2">

                <div
                  onClick={() => toggleGroup(config.type)}
                  className=" items-center justify-start primary-50 border border-border rounded-lg cursor-pointer hover:primary-100 transition"
                >
                  <div className="flex items-center gap-2">
                    <div className="bg-primary-700 mx-5 my-2 rounded-full p-2">
                      <config.icon className="w-5  h-5   text-white" />
                    </div>
                    <span className="font-medium text-sm text-text">{config.label}</span>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-text" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-text" />
                  )}
                </div>
                {isOpen && (
                  <div className="mt-2 ml-6 space-y-2">
                    {config.children.map((child, j) => (
                      <DraggableNode key={`${config.type}-${j}`} {...child} />
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return <DraggableNode key={i} {...config} />;
        })}
      </div>
    </div>
  );
};
export default React.memo(Sidebar);