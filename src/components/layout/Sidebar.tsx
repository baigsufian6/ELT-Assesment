import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-white shadow-md h-screen fixed">
      <div className="p-4">
        <Image src="/images/logo.png" alt="Logo" width={150} height={50} />
      </div>
      <nav className="mt-8">
        <ul>
          <li className="p-3 hover:bg-gray-100 cursor-pointer">
            <Link href="/">Home</Link>
          </li>
          <li className="p-3 hover:bg-gray-100 cursor-pointer">
            <Link href="/exam">Exam</Link>
          </li>
          <li className="p-3 hover:bg-gray-100 cursor-pointer">
            <Link href="/exam/results">Results</Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;