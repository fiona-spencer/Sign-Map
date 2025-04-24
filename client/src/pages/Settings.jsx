import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import {
  Sidebar,
  SidebarItem,
  SidebarItemGroup,
  SidebarItems,
  Button,
  Dropdown
} from "flowbite-react";
import {
  HiArrowSmRight,
  HiChartPie,
  HiInbox,
  HiTable,
  HiUser,
  HiStar,
  HiQuestionMarkCircle,
  HiMenu,
  HiX
} from "react-icons/hi";

export default function Settings() {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isFixed, setIsFixed] = useState(false); // For sidebar position
  const [isButtonFixed, setIsButtonFixed] = useState(true); // 🔥 New state for button position

  const dropdownRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);
  const userType = currentUser?.userType || null;
  const username = currentUser?.username || 'Guest';

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
        setIsButtonFixed(true);
      } else {
        setIsButtonFixed(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const sharedItems = [
    { href: "/help", label: "Help Center", icon: HiQuestionMarkCircle },
    { href: "/contactSupport", label: "Contact Support", icon: HiQuestionMarkCircle },
    { href: "/signout", label: "Sign Out", icon: HiArrowSmRight },
  ];

  const menuItems = () => {
    if (!userType) {
      return [
        { href: "/start", label: "Start Here", icon: HiChartPie },
        { href: "/signin", label: "Sign In", icon: HiArrowSmRight },
        { href: "/signup", label: "Sign Up", icon: HiTable },
        ...sharedItems,
      ];
    }

    if (userType === 'public') {
      return [
        { href: "/signin", label: "Sign In", icon: HiArrowSmRight },
        { href: "/signup", label: "Sign Up", icon: HiTable },
        ...sharedItems,
      ];
    }

    if (userType === 'user') {
      return [
        { href: "/my-pins", label: "My Pins", icon: HiStar },
        { href: "/favourites", label: "Favourites", icon: HiStar },
        { href: "/updates", label: "Updates", icon: HiChartPie },
        ...sharedItems,
      ];
    }

    if (userType === 'admin') {
      return [
        { href: "/submitted", label: "Submitted Markers", icon: HiInbox },
        { href: "/users", label: "Active Users", icon: HiUser },
        { href: "/logs", label: "Page Log", icon: HiTable },
        { href: "/analytics", label: "Analytics", icon: HiChartPie },
        ...sharedItems,
      ];
    }

    return [];
  };

  return (
    <div
      className={`
        z-10 bg-white dark:bg-gray-800 text-green-700 dark:text-green-400 shadow-md
        ${isMobile
          ? 'absolute top-[125px] left-0 w-full'
          : `top-[125px] left-0 ${isFixed ? 'fixed' : 'absolute'} ${sidebarOpen ? 'w-64' : 'w-0'} h-[calc(100vh-125px)] transition-all duration-300 overflow-hidden`
        }
      `}
    >
      {/* Mobile: Hide green button */}
      {!isMobile && (
        <Button
          onClick={() => {
            setSidebarOpen(prev => !prev);
            setIsFixed(prev => !prev); // Sidebar fixed/absolute
            setIsButtonFixed(prev => !prev); // Button fixed/absolute
          }}
          className={`
            ${isButtonFixed ? 'absolute top-[15px] left-3' : 'fixed top-[138px] left-3'}
            z-50 bg-green-600 shadow-md dark:bg-gray-700
          `}
        >
          {sidebarOpen ? (
            <HiX className="w-5 h-5 text-white" />
          ) : (
            <HiMenu className="w-5 h-5 text-white" />
          )}
        </Button>
      )}

      {/* User Info */}
      {sidebarOpen && !isMobile && (
        <div className="p-4 pl-20 text-xs text-gray-700 dark:text-gray-200 border-b border-gray-300 dark:border-gray-600">
          <p><strong>User:</strong> {username}</p>
          <p><strong>Role:</strong> {userType || 'Guest'}</p>
        </div>
      )}

      {/* Mobile View: Dropdown */}
      {isMobile && (
  <div className="p-4 truncate max-w-full">
    <div className="w-full">
      <Dropdown label="Settings" className="p-2" color="dark" inline>
        {menuItems().map((item) => (
          <Dropdown.Item
            key={item.label}
            icon={item.icon}
            onClick={() => window.location.href = item.href}
            className="text-sm"
            color='light'
          >
            {item.label}
          </Dropdown.Item>
        ))}
      </Dropdown>
    </div>
  </div>
)}



      {/* Desktop View: Sidebar */}
      {!isMobile && sidebarOpen && (
        <Sidebar className="h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 text-sm">
          <SidebarItems>
            <SidebarItemGroup className="space-y-1 px-3 py-2">
              {menuItems().map((item) => (
                <SidebarItem
                  href={item.href}
                  key={item.label}
                  icon={item.icon}
                  className="text-xs px-2 py-1 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors duration-150"
                >
                  {item.label}
                </SidebarItem>
              ))}
            </SidebarItemGroup>
          </SidebarItems>
        </Sidebar>
      )}
    </div>
  );
}
