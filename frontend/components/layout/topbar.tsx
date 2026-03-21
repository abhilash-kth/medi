// 'use client';

// import { useRouter } from 'next/navigation';

// export function Topbar() {
//   const router = useRouter();

//   const handleLogout = async () => {
//     try {
//       // Call the logout API to delete the cookie
//       const res = await fetch('/api/admin/logout', {
//         method: 'POST',
//       });

//       if (res.ok) {
//         // Redirect to login page
//         router.replace('/login'); // prevents going back with back-button
//       } else {
//         const data = await res.json();
//         alert(data.message || 'Logout failed');
//       }
//     } catch (err) {
//       console.error('Logout error:', err);
//       alert('Something went wrong while logging out.');
//     }
//   };

//   return (
//     <header className="h-14 border-b border-border glass flex items-center justify-between px-6">
//       <h1 className="text-lg font-semibold">Admin Dashboard</h1>

//       <button
//         onClick={handleLogout}
//         className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
//       >
//         Logout
//       </button>
//     </header>
//   );
// }


'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function Topbar() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/admin/logout', {
        method: 'POST',
      });

      if (res.ok) {
        router.replace('/login');
      } else {
        const data = await res.json();
        alert(data.message || 'Logout failed');
      }
    } catch (err) {
      console.error('Logout error:', err);
      alert('Something went wrong while logging out.');
    }
  };

  // 🚀 NEW: Run Scraper
  const handleRunScraper = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const res = await fetch('/api/admin/run-scraper', {
        method: 'POST',
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message || 'Scraper started successfully');
      } else {
        alert(data.error || 'Failed to start scraper');
      }
    } catch (err) {
      console.error('Scraper error:', err);
      alert('Something went wrong while starting scraper.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="h-14 border-b border-[#499f57] flex items-center justify-between px-6 bg-[#9fd6ce]">
      <h1 className="text-lg font-semibold">Admin Dashboard</h1>

      <div className="flex items-center gap-3">
        {/* 🚀 NEW BUTTON */}
        <button
          onClick={handleRunScraper}
          disabled
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-60 transition-colors"
        >
          {loading ? 'Running...' : 'Run Scraper'}
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
