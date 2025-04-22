import {
    Sidebar,
    SidebarItem,
    SidebarItemGroup,
    SidebarItems,
    SidebarLogo
  } from "flowbite-react";
  
  import {
    HiArrowSmRight,
    HiChartPie,
    HiInbox,
    HiShoppingBag,
    HiTable,
    HiUser,
    HiViewBoards,
    HiCog
  } from "react-icons/hi";
  
  export default function Settings() {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex">
        <Sidebar
          aria-label="Custom sidebar with branding"
          className="w-64 bg-white dark:bg-gray-800 text-green-700 dark:text-green-400 shadow-lg rounded-r-lg"
        >
          <SidebarLogo
            href="/"
            img="/favicon.svg"
            imgAlt="Flowbite logo"
            className="mb-4"
          >
            <span className="text-lg font-bold text-green-600 dark:text-green-300">GreenDash</span>
          </SidebarLogo>
  
          <SidebarItems>
            <SidebarItemGroup>
              <SidebarItem href="/dashboard" icon={HiChartPie}>
                Dashboard
              </SidebarItem>
              <SidebarItem href="/kanban" icon={HiViewBoards}>
                Kanban
              </SidebarItem>
              <SidebarItem href="/inbox" icon={HiInbox}>
                Inbox
              </SidebarItem>
              <SidebarItem href="/users" icon={HiUser}>
                Users
              </SidebarItem>
              <SidebarItem href="/products" icon={HiShoppingBag}>
                Products
              </SidebarItem>
              <SidebarItem href="/settings" icon={HiCog}>
                Settings
              </SidebarItem>
              <SidebarItem href="/signin" icon={HiArrowSmRight}>
                Sign In
              </SidebarItem>
              <SidebarItem href="/signup" icon={HiTable}>
                Sign Up
              </SidebarItem>
            </SidebarItemGroup>
          </SidebarItems>
        </Sidebar>
  
        {/* Example main content area beside sidebar */}
        <div className="flex-1 p-6 text-gray-800 dark:text-gray-100">
          <h1 className="text-2xl font-semibold mb-4">Welcome to GreenDash</h1>
          <p>This is your main content area. Add routes or content here.</p>
        </div>
      </div>
    );
  }
  