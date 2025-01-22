import React from 'react';
import Link from 'next/link';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center fixed top-0 w-full z-50">
      <div className="text-xl font-bold">
        <Link href="/">Exam Portal</Link>
      </div>
      <div className="flex space-x-4">
        <Link href="/exam" className="text-blue-500 hover:underline">Start Exam</Link>
        <Link href="/exam/results" className="text-blue-500 hover:underline">View Results</Link>
      </div>
    </header>
  );
};

export default Header;