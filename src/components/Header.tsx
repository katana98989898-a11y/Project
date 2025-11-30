// src/components/Header.tsx
import { Search } from 'lucide-react';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* ЛОГОТИП СЛЕВА */}
        <div className="flex items-center">
          <img 
            src="/TikTok_logo.svg" 
            alt="TikTok" 
            className="h-8 w-auto"
          />
        </div>

        {/* ПОИСК ПО ЦЕНТРУ */}
        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
          </div>
        </div>

        {/* АВАТАР СПРАВА */}
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300">
          <Image
            src="/image.jpeg"
            alt="User"
            width={40}
            height={40}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
}