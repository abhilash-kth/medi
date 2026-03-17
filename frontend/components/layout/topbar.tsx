'use client';

import { useRouter } from 'next/navigation';

export function Topbar() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Call the logout API to delete the cookie
      const res = await fetch('/api/admin/logout', {
        method: 'POST',
      });

      if (res.ok) {
        // Redirect to login page
        router.replace('/login'); // prevents going back with back-button
      } else {
        const data = await res.json();
        alert(data.message || 'Logout failed');
      }
    } catch (err) {
      console.error('Logout error:', err);
      alert('Something went wrong while logging out.');
    }
  };

  return (
    <header className="h-14 border-b border-border glass flex items-center justify-between px-6">
      <h1 className="text-lg font-semibold">Admin Dashboard</h1>

      <button
        onClick={handleLogout}
        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
      >
        Logout
      </button>
    </header>
  );
}
