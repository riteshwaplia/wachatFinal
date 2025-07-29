// import React, { useState, useEffect } from 'react';

// function Layout({ children }) {
//   const [darkMode, setDarkMode] = useState(() => {
//     if (typeof window !== 'undefined') {
//       return localStorage.getItem('theme') === 'dark';
//     }
//     return false;
//   });

//   useEffect(() => {
//     const root = window.document.documentElement;
//     if (darkMode) {
//       root.classList.add('dark');
//       localStorage.setItem('theme', 'dark');
//     } else {
//       root.classList.remove('dark');
//       localStorage.setItem('theme', 'light');
//     }
//   }, [darkMode]);

//   return (
//     <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300">
//       <div className="p-8">
//         <h1 className="text-3xl font-bold mb-4">Light/Dark Mode in React</h1>
//         <button
//           onClick={() => setDarkMode((prev) => !prev)}
//           className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
//         >
//           Toggle {darkMode ? 'Light' : 'Dark'} Mode
//         </button>
//       </div>
//       <main>{children}</main>
//     </div>
//   );
// }

// export default Layout;
