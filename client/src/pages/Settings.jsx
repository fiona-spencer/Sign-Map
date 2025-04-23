import React, { useState } from 'react';
import {
    Sidebar,
    SidebarItem,
    SidebarItemGroup,
    SidebarItems,
    SidebarLogo,
    SidebarCollapse
} from "flowbite-react";

import {
    HiArrowSmRight,
    HiChartPie,
    HiInbox,
    HiTable,
    HiUser,
    HiViewBoards,
    HiCog,
    HiSearch,
    HiStar,
    HiQuestionMarkCircle,
    HiShoppingBag
} from "react-icons/hi";

export default function Settings() {
    const [logCollapseOpen, setLogCollapseOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    return (
        <div className="bg-gray-100 dark:bg-gray-900 flex">
            {/* Sidebar */}
            <Sidebar
                aria-label="Sidebar with content separator example"
                className="w-64 bg-white dark:bg-gray-800 text-green-700 dark:text-green-400 shadow-lg rounded-r-lg h-full"
            >
                <SidebarLogo
                    href="/"
                    img="/favicon.svg"
                    imgAlt="Flowbite logo"
                    className="mb-4"
                >
                    <span className="text-xs font-bold text-green-600 dark:text-green-300">GreenDash</span>
                </SidebarLogo>

                {/* Search Bar */}
                <div className="p-4">
                    <div className="flex items-center space-x-2">
                        <HiSearch className="text-gray-400 dark:text-gray-300" />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="w-full p-2 border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white text-xs"
                        />
                    </div>
                </div>

                {/* Favourites Section */}
                <SidebarItems>
                    <SidebarItemGroup>
                        <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">Favourites</h3>
                        <SidebarItem href="/dashboard" icon={HiStar} className="text-xs">
                            Favourite Dashboard
                        </SidebarItem>
                        <SidebarItem href="/kanban" icon={HiStar} className="text-xs">
                            Favourite Kanban
                        </SidebarItem>
                    </SidebarItemGroup>
                </SidebarItems>

                {/* Main Sidebar Sections */}
                <SidebarItems>
                    <SidebarItemGroup>
                        <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">Main Sections</h3>
                        <SidebarItem href="/dashboard" icon={HiChartPie} className="text-xs">
                            Dashboard
                        </SidebarItem>
                        <SidebarItem href="/kanban" icon={HiViewBoards} className="text-xs">
                            Kanban
                        </SidebarItem>
                        <SidebarItem href="/users" icon={HiUser} className="text-xs">
                            Active Users
                        </SidebarItem>
                        {/* Submitted Markers Inbox with Label aligned on the same row */}
                        <div className="items-center">
                            <SidebarItem href="/inbox" icon={HiInbox} className="text-xs" label="3" labelColour="dark">
                                Submitted Markers Inbox
                            </SidebarItem>
                        </div>
                    </SidebarItemGroup>
                </SidebarItems>

                {/* Log Page - Collapsible Section */}
                <SidebarItems>
                    <SidebarCollapse
                        icon={HiTable}
                        label="Log Page"
                        open={logCollapseOpen}
                        onClick={() => setLogCollapseOpen(!logCollapseOpen)}
                    >
                        <SidebarItem href="#" className="text-xs">Log Entries</SidebarItem>
                        <SidebarItem href="#" className="text-xs">System Logs</SidebarItem>
                        <SidebarItem href="#" className="text-xs">User Activity Logs</SidebarItem>
                    </SidebarCollapse>
                </SidebarItems>

                {/* Help Section */}
                <SidebarItems>
                    <SidebarItemGroup>
                        <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">Help</h3>
                        <SidebarItem href="/help" icon={HiQuestionMarkCircle} className="text-xs">
                            Help Center
                        </SidebarItem>
                        <SidebarItem href="/contact" icon={HiQuestionMarkCircle} className="text-xs">
                            Contact Support
                        </SidebarItem>
                    </SidebarItemGroup>
                </SidebarItems>

                {/* Sign In / Sign Up */}
                <SidebarItems>
                    <SidebarItemGroup>
                        <SidebarItem href="/signin" icon={HiArrowSmRight} className="text-xs">
                            Sign In
                        </SidebarItem>
                        <SidebarItem href="/signup" icon={HiTable} className="text-xs">
                            Sign Up
                        </SidebarItem>
                    </SidebarItemGroup>
                </SidebarItems>
            </Sidebar>

            {/* Main content area */}
            <div className="flex-1 p-6 text-gray-800 dark:text-gray-100">
                <h1 className="text-xl font-semibold mb-4">Welcome to GreenDash</h1>
                <p className="text-xs">This is your main content area. Add routes or content here.</p>
            </div>
        </div>
    );
}
