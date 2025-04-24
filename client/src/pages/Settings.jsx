import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Sidebar,
  SidebarItem,
  SidebarItemGroup,
  SidebarLogo,
  SidebarItems,
} from "flowbite-react";
import {
  HiArrowSmRight,
  HiChartPie,
  HiInbox,
  HiTable,
  HiUser,
  HiViewBoards,
  HiCog,
  HiStar,
  HiQuestionMarkCircle,
} from "react-icons/hi";

export default function Settings() {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const { currentUser } = useSelector((state) => state.user);
  const userType = currentUser?.userType || null;
  const username = currentUser?.username || 'Guest';

  // Determine sidebar content based on userType
  const renderSidebarItems = () => {
    if (!userType) {
      // Not signed in
      return (
        <>
          <SidebarItem href="/start" icon={HiChartPie} className="text-xs">Start Here</SidebarItem>
          <SidebarItem href="/signin" icon={HiArrowSmRight} className="text-xs">Sign In</SidebarItem>
          <SidebarItem href="/signup" icon={HiTable} className="text-xs">Sign Up</SidebarItem>
          <SidebarItem href="/help" icon={HiQuestionMarkCircle} className="text-xs">Help Center</SidebarItem>
          <SidebarItem href="/contactSupport" icon={HiQuestionMarkCircle} className="text-xs">Contact Support</SidebarItem>
        </>
      );
    }

    const shared = (
      <>
        <SidebarItem href="/help" icon={HiQuestionMarkCircle} className="text-xs">Help Center</SidebarItem>
        <SidebarItem href="/contactSupport" icon={HiQuestionMarkCircle} className="text-xs">Contact Support</SidebarItem>
        <SidebarItem href="/signout" icon={HiArrowSmRight} className="text-xs">Sign Out</SidebarItem>
      </>
    );

    if (userType === 'public') {
      return (
        <>
          <SidebarItem href="/signin" icon={HiArrowSmRight} className="text-xs">Sign In</SidebarItem>
          <SidebarItem href="/signup" icon={HiTable} className="text-xs">Sign Up</SidebarItem>
          {shared}
        </>
      );
    }

    if (userType === 'user') {
      return (
        <>
          <SidebarItem href="/my-pins" icon={HiStar} className="text-xs">My Pins</SidebarItem>
          <SidebarItem href="/favourites" icon={HiStar} className="text-xs">Favourites</SidebarItem>
          <SidebarItem href="/updates" icon={HiChartPie} className="text-xs">Updates</SidebarItem>
          {shared}
        </>
      );
    }

    if (userType === 'admin') {
      return (
        <>
          <SidebarItem href="/submitted" icon={HiInbox} className="text-xs">Submitted Markers</SidebarItem>
          <SidebarItem href="/users" icon={HiUser} className="text-xs">Active Users</SidebarItem>
          <SidebarItem href="/logs" icon={HiTable} className="text-xs">Page Log</SidebarItem>
          <SidebarItem href="/analytics" icon={HiChartPie} className="text-xs">Analytics</SidebarItem>
          {shared}
        </>
      );
    }
  };

  return (
    <div className="flex h-screen absolute z-0">
      {/* Sidebar */}
      <div
        className={`fixed top-[125px] left-0 h-[calc(100vh-100px)] z-0 w-64 bg-white dark:bg-gray-800 text-green-700 dark:text-green-400 shadow-md transition-transform duration-300`}
      >
        <Sidebar className="h-full z-0">
          {/* <SidebarLogo
            href="/"
            img="/favicon.svg"
            imgAlt="GreenDash Logo"
            className="mb-4"
          >
            <span className="text-xs font-bold text-green-600 dark:text-green-300">Settings</span>
          </SidebarLogo> */}

          {/* User Info */}
          <div className="px-4 pb-2 text-xs text-gray-700 dark:text-gray-200">
            <p><strong>User:</strong> {username}</p>
            <p><strong>Role:</strong> {userType || 'Guest'}</p>
          </div>

          {/* Sidebar Items */}
          <SidebarItems>
            <SidebarItemGroup>
              {renderSidebarItems()}
            </SidebarItemGroup>
          </SidebarItems>
        </Sidebar>
      </div>
    </div>
  );
}
