import React, { useState, useEffect, useRef } from "react";
import {
  FaBeer,
  FaApple,
  FaAnchor,
  FaCoffee,
  FaCar,
  FaCat,
  FaDog,
  FaHome,
  FaSearch,
  FaInfoCircle,
  FaPlane,
  FaRocket,
  FaStar,
  FaTrashAlt,
  FaUser,
  FaBell,
  FaCloud,
  FaCogs,
  FaBriefcase,
  FaCamera,
  FaClock,
  FaDesktop,
  FaEdit,
  FaHeart,
  FaMapMarker,
  FaPhone,
  FaShoppingCart,
  FaTv,
  FaVolumeUp,
  FaWifi,
  FaBicycle,
  FaGlobe,
  FaLaptop,
  FaUserAlt,
  FaSignInAlt,
  FaSignOutAlt,
  FaLayerGroup,
  FaLink
} from 'react-icons/fa';

// List of all icons as strings
const allIcons = [
  "FaBeer", "FaApple", "FaAnchor", "FaCoffee", "FaCar", "FaCat", "FaDog", "FaHome", "FaSearch", "FaInfoCircle",
  "FaPlane", "FaRocket", "FaStar", "FaTrashAlt", "FaUser", "FaBell", "FaCloud", "FaCogs", "FaBriefcase", "FaCamera",
  "FaClock", "FaDesktop", "FaEdit", "FaHeart", "FaMapMarker", "FaPhone", "FaShoppingCart", "FaTv", "FaVolumeUp",
  "FaWifi", "FaBicycle", "FaGlobe", "FaLaptop", "FaUserAlt", "FaSignInAlt", "FaSignOutAlt", "FaLayerGroup", "FaLink"
];

// Create a map to associate icon names with components
const iconMap = {
  FaBeer,
  FaApple,
  FaAnchor,
  FaCoffee,
  FaCar,
  FaCat,
  FaDog,
  FaHome,
  FaSearch,
  FaInfoCircle,
  FaPlane,
  FaRocket,
  FaStar,
  FaTrashAlt,
  FaUser,
  FaBell,
  FaCloud,
  FaCogs,
  FaBriefcase,
  FaCamera,
  FaClock,
  FaDesktop,
  FaEdit,
  FaHeart,
  FaMapMarker,
  FaPhone,
  FaShoppingCart,
  FaTv,
  FaVolumeUp,
  FaWifi,
  FaBicycle,
  FaGlobe,
  FaLaptop,
  FaUserAlt,
  FaSignInAlt,
  FaSignOutAlt,
  FaLayerGroup,
  FaLink
};

interface IconPickerProps {
  activeIcon: string;
  setActiveIcon: (iconName: string) => void;
}

const IconPicker: React.FC<IconPickerProps> = ({ activeIcon, setActiveIcon }) => {
  const [filteredIcons, setFilteredIcons] = useState<string[]>(allIcons.slice(0, 15));
  const [searchQuery, setSearchQuery] = useState('');
  const [loadedIcons, setLoadedIcons] = useState<number>(15);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null); // Add reference to the list container

  // Handle Search Input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    const filtered = allIcons.filter(icon => icon.toLowerCase().includes(e.target.value.toLowerCase()));
    setFilteredIcons(filtered.slice(0, 15)); // Reset to 15 icons when searching
    setLoadedIcons(15);
  };

  // Load More Icons on Scroll
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const nearBottom = target.scrollTop + target.clientHeight >= target.scrollHeight - 10; // 10px before reaching the bottom
    console.log(nearBottom, loadedIcons, filteredIcons.length);
    
    console.log(`Scroll position: ${target.scrollTop}, Scroll height: ${target.scrollHeight}, Client height: ${target.clientHeight}`);
    
    if (nearBottom && loadedIcons <= filteredIcons.length) {
      setLoadedIcons(prev => prev + 15);
    }
  };   

  useEffect(() => {
    const filtered = searchQuery ? allIcons.filter(icon => icon.toLowerCase().includes(searchQuery.toLowerCase())) : allIcons;
    setFilteredIcons(filtered.slice(0, loadedIcons));
  }, [loadedIcons, searchQuery]);

  return (
    <div className="icon-picker w-full max-w-xl p-4 bg-gray-900 text-white border border-gray-700 rounded-lg shadow-lg">
      <input
        ref={inputRef}
        type="text"
        placeholder="Search icons..."
        value={searchQuery}
        onChange={handleSearch}
        className="w-full p-2 mb-4 border border-gray-600 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div
        ref={listRef} // Attach ref to the scrollable container
        className="icon-list grid grid-cols-5 gap-4 overflow-y-auto overflow-x-hidden no-scrollbar max-h-56 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
        onScroll={handleScroll}
      >
        {filteredIcons.slice(0, loadedIcons).map((iconName, index) => {
          const IconComponent = iconMap[iconName as keyof typeof iconMap]; // Get the icon component from the map
          const isActive = iconName === activeIcon;
          return (
            <div
              key={index}
              className={`icon-item text-center cursor-pointer p-2 rounded-lg transition duration-150 ease-in-out ${isActive ? 'bg-slate-800' : 'hover:bg-gray-700'}`}
              onClick={() => setActiveIcon(iconName)}
            >
              <div className={`icon flex items-center pt-1 justify-center text-xl ${isActive ? '!text-white' : 'text-gray-400'}`}>
                <IconComponent />
              </div>
              <span className="text-xs text-gray-400">{iconName.replace(/^Fa/, '')}</span>
            </div>
          );
        })}

        {/* Invisible div to trigger scroll event */}
        <div className="w-full" style={{ height: `${loadedIcons < filteredIcons.length ? 32 : 0}px` }}></div>
      </div>
    </div>
  );
};

export default IconPicker;
