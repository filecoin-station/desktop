import { Dialog, Transition } from "@headlessui/react";
import {
  CogIcon,
  FolderIcon,
  LockClosedIcon,
  MenuIcon,
  ServerIcon,
  StatusOnlineIcon,
  XIcon,
} from "@heroicons/react/outline";
import { useTheme } from "next-themes";
import { Fragment, useState } from "react";
import { classNames } from "../helpers";
import ThemeSwitch from "./ThemeSwitch";

const navigation = [
  { name: "Status", href: "#", icon: StatusOnlineIcon, current: true },
  { name: "Wallet", href: "#", icon: LockClosedIcon, current: false },
  { name: "Retrievals", href: "#", icon: FolderIcon, current: false },
];

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div>
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 flex z-40 md:hidden"
          onClose={setSidebarOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-slate-700">
              <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="absolute top-0 right-0 -mr-12 pt-2">
                  <button
                    type="button"
                    className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </button>
                </div>
              </Transition.Child>
              <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                <div className="flex-shrink-0 flex items-center px-4">
                  {/* <img
                    className="h-8 w-auto"
                    src="https://tailwindui.com/img/logos/workflow-logo-slate-300-mark-white-text.svg"
                    alt="Workflow"
                  /> */}
                  <h1 className="text-white font-semibold text-2xl">Station</h1>
                </div>
                <nav className="mt-5 px-2 space-y-1">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className={classNames(
                        item.current
                          ? "bg-slate-800 text-white"
                          : "text-white hover:bg-slate-600 hover:bg-opacity-75",
                        "group flex items-center px-2 py-2 text-base font-medium rounded-md"
                      )}
                    >
                      <item.icon
                        className="mr-4 flex-shrink-0 h-6 w-6 text-slate-300"
                        aria-hidden="true"
                      />
                      {item.name}
                    </a>
                  ))}
                </nav>
              </div>
              <div className="flex-shrink-0 flex bg-slate-700 p-4">
                <a href="#" className="flex-shrink-0 w-full group block">
                  <div className="flex items-center">
                    <div>
                      <CogIcon className="inline-block h-9 w-9 text-white" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-white">
                        Filecoin Station
                      </p>
                      <p className="text-xs font-medium text-slate-300 group-hover:text-slate-200">
                        View settings
                      </p>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </Transition.Child>
          <div className="flex-shrink-0 w-14" aria-hidden="true">
            {/* Force sidebar to shrink to fit close icon */}
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-slate-800">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4 justify-between">
              {/* <img
                  className="h-8 w-auto"
                  src="https://tailwindui.com/img/logos/workflow-logo-slate-300-mark-white-text.svg"
                  alt="Workflow"
                /> */}
              <h1 className="text-slate-900 dark:text-white font-semibold text-2xl">
                Station
              </h1>
              <ThemeSwitch />
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={classNames(
                    item.current
                      ? "bg-gray-100 text-slate-900 dark:bg-slate-900 dark:text-white"
                      : "bg-white dark:bg-slate-800 text-slate-500 hover:text-slate-900 hover:bg-gray-100 dark:text-white dark:hover:bg-slate-600 dark:hover:bg-opacity-75",
                    "group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                  )}
                >
                  <item.icon
                    className="mr-3 flex-shrink-0 h-6 w-6 dark:text-slate-500"
                    aria-hidden="true"
                  />
                  {item.name}
                </a>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex bg-gray-200 dark:bg-slate-700 p-4">
            <a href="#" className="flex-shrink-0 w-full group block">
              <div className="flex items-center">
                <div>
                  <CogIcon className="inline-block h-9 w-9 text-slate-900 dark:text-white" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    Filecoin Station
                  </p>
                  <p className="text-xs font-medium text-slate-900 dark:text-white dark:group-hover:text-slate-200">
                    View settings
                  </p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
      <div className="md:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-white dark:bg-slate-800 justify-between flex items-center pr-4">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-slate-500"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <MenuIcon className="h-6 w-6 " aria-hidden="true" />
          </button>
          <ThemeSwitch />
        </div>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
