// Updated TemplateCard.jsx for redesign with better structure and equal height buttons
import React from 'react';
import PropTypes from 'prop-types';
import {
  Edit,
  Upload,
  Trash2,
  Link as LinkIcon,
  MessageSquare,
  Megaphone,
  Globe,
  Eye,
  Code
} from 'lucide-react';
import Button from '../Button';
import Badge from '../Badge';
import Card from '../Card';
import api from '../../utils/api';

const getStatusBadgeType = (status) => {
  switch (status) {
    case 'APPROVED': return 'success';
    case 'PENDING': return 'warning';
    case 'REJECTED': return 'danger';
    case 'DRAFT': return 'info';
    default: return 'secondary';
  }
};

const TemplateCard = ({ template, onEdit, onUpload, onDelete, onViewDetails ,handleSyncTemplates }) => {
const project = localStorage.getItem("currentProject")
    ? JSON.parse(localStorage.getItem("currentProject"))
    : null;
  const businessProfileId = project?.businessProfileId._id || null;
  const handleSubmitToMeta = async (template) => {
        try {
            const res = await api.post(`/templates/${template._id}/submit-to-meta`, {businessProfileId});
            console.log("res", res);
        } catch (error) {
            console.error('Error submitting template:', error);
            
        } finally {
        }
    };

  

  return (
   <div className="flex flex-col border border-gray-200 rounded-lg h-full overflow-hidden hover:shadow-md transition-shadow duration-200 bg-[#f0f2f5]">
  {/* WhatsApp Preview Area */}
  <div className="p-3 bg-[#e5ddd5] bg-opacity-30 flex-1 flex flex-col">
    <div className="bg-white rounded-lg shadow-sm w-full max-w-xs mx-auto overflow-hidden">
      {/* WhatsApp header bar */}
      <div className="bg-[#00a884] p-2 flex items-center">
        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="#00a884">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </div>
        <div className="ml-2 flex-1">
          <div className="text-white text-xs font-medium">Business Name</div>
          <div className="text-white text-xxs opacity-80">WhatsApp Business</div>
        </div>
        <div className="text-white text-xs">12:30 PM</div>
      </div>

      {/* Message content */}
      <div className="p-3 text-[#111b21]">
        {template.components?.map((component, index) => {
          switch(component.type) {
            case 'HEADER':
              return (
                <div key={index} className="mb-3">
                  {component.format === 'IMAGE' ? (
                    <div className="relative">
                      <img
                        src={component.example?.header_handle?.[0] || 'https://placehold.co/300x120?text=Header+Image'}
                        alt="Header"
                        className="w-full h-32 object-cover rounded-lg"
                        onError={(e) => { e.target.src = 'https://placehold.co/300x120?text=Image+Not+Found'; }}
                      />
                      <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xxs px-2 py-1 rounded">
                        ADVERTISEMENT
                      </div>
                    </div>
                  ) : (
                    <div className="font-semibold text-sm text-[#111b21]">
                      {component.text || 'Header Text'}
                    </div>
                  )}
                </div>
              );

            case 'BODY':
              return (
                <div key={index} className="text-sm mb-3 whitespace-pre-line leading-tight">
                  {component.text || 'Body with {{1}} {{2}} placeholders'}
                </div>
              );

            case 'FOOTER':
              return (
                <div key={index} className="text-xxs text-[#667781] mt-2 mb-3">
                  {component.text || 'Optional footer text'}
                </div>
              );

            case 'BUTTONS':
              return (
                <div key={index} className="mt-3 space-y-2">
                  {component.buttons?.map((btn, btnIndex) => (
                    <button
                      key={btnIndex}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center 
                        ${btn.type === 'URL' 
                          ? 'bg-[#008069] text-white' 
                          : 'bg-[#f0f2f5] text-[#008069] border border-[#008069]'
                        }`}
                      onClick={(e) => e.preventDefault()}
                    >
                      {btn.type === 'URL' && (
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" className="mr-2">
                          <path d="M10 6V8H5V19H16V14H18V20C18 20.5523 17.5523 21 17 21H4C3.44772 21 3 20.5523 3 20V7C3 6.44772 3.44772 6 4 6H10ZM21 3V11H19V6.413L11.207 14.207L9.793 12.793L17.585 5H13V3H21Z" />
                        </svg>
                      )}
                      <span className="truncate">{btn.text}</span>
                    </button>
                  ))}
                </div>
              );

            default:
              return null;
          }
        })}
      </div>
    </div>
  </div>

  {/* Template Metadata */}
  <div className="bg-white p-3 border-t border-gray-200">
    <div className="flex justify-between items-start mb-1">
      <h3 className="font-medium text-sm text-gray-800 truncate">
        {template.name}
      </h3>
      <span className={`text-xxs px-2 py-1 rounded-full ${
        template.metaStatus === 'APPROVED' ? 'bg-green-100 text-green-800' :
        template.metaStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
        template.metaStatus === 'REJECTED' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
      }`}>
        {template.metaStatus || 'Draft'}
      </span>
    </div>

    <div className="flex items-center space-x-2 text-xxs text-gray-500 mb-2">
      <span className="flex items-center">
        <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" className="mr-1">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
        </svg>
        {template.metaCategory || template.category}
      </span>
      <span className="flex items-center">
        <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" className="mr-1">
          <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z" />
        </svg>
        {template.language}
      </span>
    </div>

    {template.metaTemplateId && (
      <div className="text-xxs text-gray-400 flex items-center">
        <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" className="mr-1">
          <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" />
        </svg>
        ID: {template.metaTemplateId}
      </div>
    )}

    <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-100">
      <div className="flex space-x-1">
        {/* <button 
          onClick={() => onEdit(template)} 
          className="p-1 text-gray-500 hover:text-[#008069] rounded-full"
          aria-label="Edit"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
          </svg>
        </button> */}
        {(!template.isSynced || template.metaStatus === 'REJECTED') && (
          <button 
            onClick={() => onUpload(template)} 
            className="p-1 text-gray-500 hover:text-[#008069] rounded-full"
            aria-label="Upload"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
            </svg>
          </button>
        )}
        <button 
  onClick={() => onDelete(template)} // pass full template, not just ID
  className="p-1 text-gray-500 hover:text-red-500 rounded-full"
  aria-label="Delete"
>
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
  </svg>
</button>

         <button 
        onClick={() => onViewDetails(template)} 
        className="text-xs text-[#008069] hover:bg-[#00806910] px-2 py-1 rounded-full flex items-center"
      >
        <svg viewBox="0 0 24 24" width="14" height="14" fill="#008069" className="mr-1">
          <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
        </svg>
      </button>
      </div>
      
      <button 
        onClick={handleSyncTemplates} 
        className="text-xs text-[#008069] hover:bg-[#00806910] px-2 py-1 rounded-full flex items-center"
      >
        <svg viewBox="0 0 24 24" width="14" height="14" fill="#008069" className="mr-1">
          <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
        </svg>
        check status
      </button>
    </div>
  </div>
</div>
  );
};

TemplateCard.propTypes = {
  template: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onUpload: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onViewDetails: PropTypes.func.isRequired,
};

export default TemplateCard;
