// components/ui/ErrorMessage.js
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { ExclamationTriangleIcon, XCircleIcon, InformationCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const ErrorMessage = ({ 
  message, 
  type = 'error', 
  fullPage = false, 
  onRetry, 
  retryText = 'Try Again',
  showHomeButton = true,
  className = '' 
}) => {
  const navigate = useNavigate();

  // Determine icon and colors based on message type
  const getIconAndColors = () => {
    switch (type.toLowerCase()) {
      case 'warning':
        return {
          icon: <ExclamationTriangleIcon className="h-12 w-12 text-yellow-500" />,
          bgColor: 'bg-yellow-50',
          textColor: 'text-yellow-700',
          borderColor: 'border-yellow-300'
        };
      case 'info':
        return {
          icon: <InformationCircleIcon className="h-12 w-12 text-blue-500" />,
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-700',
          borderColor: 'border-blue-300'
        };
      case 'success':
        return {
          icon: <CheckCircleIcon className="h-12 w-12 text-green-500" />,
          bgColor: 'bg-green-50',
          textColor: 'text-green-700',
          borderColor: 'border-green-300'
        };
      default: // error
        return {
          icon: <XCircleIcon className="h-12 w-12 text-red-500" />,
          bgColor: 'bg-red-50',
          textColor: 'text-red-700',
          borderColor: 'border-red-300'
        };
    }
  };

  const { icon, bgColor, textColor, borderColor } = getIconAndColors();

  const containerClasses = `rounded-md ${bgColor} p-4 border ${borderColor} ${fullPage ? 'min-h-screen flex flex-col items-center justify-center' : ''} ${className}`;
  const contentClasses = `flex ${fullPage ? 'flex-col items-center text-center' : ''}`;

  return (
    <div className={containerClasses}>
      <div className={contentClasses}>
        <div className="flex-shrink-0">
          {icon}
        </div>
        <div className={`ml-3 ${fullPage ? 'mt-4' : ''}`}>
          <h3 className={`text-lg font-medium ${textColor}`}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </h3>
          <div className={`mt-2 text-sm ${textColor}`}>
            <p>{message}</p>
          </div>
          <div className="mt-4 flex space-x-3">
            {onRetry && (
              <button
                type="button"
                className={`inline-flex items-center rounded-md ${bgColor} px-3 py-2 text-sm font-medium ${textColor} hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 ${borderColor}`}
                onClick={onRetry}
              >
                {retryText}
              </button>
            )}
            {showHomeButton && (
              <button
                type="button"
                className="inline-flex items-center rounded-md bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                onClick={() => navigate('/')}
              >
                Go back home
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['error', 'warning', 'info', 'success']),
  fullPage: PropTypes.bool,
  onRetry: PropTypes.func,
  retryText: PropTypes.string,
  showHomeButton: PropTypes.bool,
  className: PropTypes.string
};

export default ErrorMessage;