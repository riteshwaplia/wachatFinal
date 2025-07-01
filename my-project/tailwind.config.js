// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ... (Your color palette from Step 2 goes here)
        // --- Brand / Primary Colors ---
        'primary-50': '#E8F2FA', // Lightest shade for hover/background
        'primary-100': '#D1E6F5',
        'primary-200': '#A4D0EB',
        'primary-300': '#77BAE1',
        'primary-400': '#4AA4D7',
        'primary-500': '#2980B9', // Your main primary color
        'primary-600': '#246D9B',
        'primary-700': '#1F5A7D',
        'primary-800': '#1A475F',
        'primary-900': '#153441',

        // Secondary: A soft, inviting green
        'secondary-50': '#EEF9F1',
        'secondary-100': '#DDF3E3',
        'secondary-200': '#BBE6C6',
        'secondary-300': '#99D9A9',
        'secondary-400': '#77CB8C',
        'secondary-500': '#5BBF6F', // Your main secondary color
        'secondary-600': '#4DA35D',
        'secondary-700': '#3E874C',
        'secondary-800': '#2F6B3B',
        'secondary-900': '#204F2A',

        // Accent: A vibrant, muted purple for CTAs/highlights
        'accent-50': '#F9EDFC',
        'accent-100': '#F3DAF8',
        'accent-200': '#E6B6F1',
        'accent-300': '#D992EB',
        'accent-400': '#CC6BE4',
        'accent-500': '#BB6BD9', // Your main accent color
        'accent-600': '#9D58B5',
        'accent-700': '#7F4591',
        'accent-800': '#61326D',
        'accent-900': '#431F49',

        // --- Neutral / Grayscale Colors ---
        'gray-50': '#F9FAFB',  // Very light off-white (for subtle backgrounds)
        'gray-100': '#F2F4F7',  // Lightest gray
        'gray-200': '#E5E8ED',
        'gray-300': '#D1D6DE',
        'gray-400': '#A6B0BD',
        'gray-500': '#7B8798',  // Mid-range gray
        'gray-600': '#5E6B7C',
        'gray-700': '#414F60',
        'gray-800': '#243244',  // Darker gray (for text on light)
        'gray-900': '#1A202C',  // Very dark charcoal (almost black, for text on light or dark mode backgrounds)

        // --- Semantic / Feedback Colors ---
        'success': '#28A745', // Green
        'warning': '#FFC107', // Amber
        'error': '#DC3545',   // Red
        'info': '#17A2B8',    // Cyan/Teal
      },
      // --- Typography ---
      fontFamily: {
        // 'sans' will replace Tailwind's default sans-serif stack
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', '"Noto Sans"', 'sans-serif', '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"', '"Noto Color Emoji"'],
        // You can add a specific font for headings if desired
        heading: ['Montserrat', 'sans-serif'],
        // You can also add a monospace font
        mono: ['Fira Code', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace'],
      },
      // --- Spacing (if you need values outside Tailwind's default scale) ---
      spacing: {
        '18': '4.5rem', // 72px
        '22': '5.5rem', // 88px
        '72': '18rem',  // 288px
        '84': '21rem',  // 336px
        '96': '24rem',  // 384px
      },
      // --- Box Shadows (for depth and modern feel) ---
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
        'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        'outline': '0 0 0 3px rgba(66, 153, 225, 0.5)', // Custom outline for focus states
        'custom-light': '0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px 0 rgba(0, 0, 0, 0.04)', // More subtle
        'custom-card': '0px 4px 10px rgba(0, 0, 0, 0.05)', // Common for cards
      },
      // --- Border Radius (for slightly softer corners) ---
      borderRadius: {
        'xl': '0.75rem', // 12px
        '2xl': '1rem',  // 16px
        '3xl': '1.5rem', // 24px
      },
      // --- Transitions (for smoother animations) ---
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      transitionDuration: {
        '400': '400ms',
        '500': '500ms',
        '750': '750ms',
      },
    },
  },
  plugins: [],
}