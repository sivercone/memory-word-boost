import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FolderIcon, MenuIcon, PlusIcon, SetIcon } from '@src/ui/Icons';
import DropdownMenu from './DropdownMenu';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <Navigation />
      {children}
    </>
  );
};

const menuOptions = [
  { id: 'profile', title: 'Profile', href: '/' },
  { id: 'logout', title: 'Log out', href: '/' },
  { id: 'login', title: 'Login', href: '/' },
  { id: 'theme', title: 'Theme', href: '/' },
];
const creationOptions = [
  { id: 'set', title: 'Create Set', href: '/sets/new', icon: <SetIcon /> },
  { id: 'folder', title: 'Create Folder', href: '/sets?folder=new', icon: <FolderIcon /> },
];

const Navigation = () => {
  const router = useRouter();

  return (
    <>
      <nav id="navigation" className="py-[16px] border-b border-b-gray-200 bg-white sticky top-0">
        <div className="flex items-center max-w-3xl mx-auto px-4">
          <Link href="/">
            <a className="flex gap-1 items-center">
              <span
                className="font-semibold bg-gradient-to-br from-gray-300 to-gray-900 box-decoration-slice bg-clip-text text-transparent"
                style={{ letterSpacing: '-0.9px', lineHeight: '0.8' }}
              >
                PROJECT MWB
              </span>
              <span className="bg-gray-100 text-xs font-medium rounded-lg px-1 text-gray-500" style={{ letterSpacing: '-0.8px' }}>
                Prototype
              </span>
            </a>
          </Link>
          <div className="ml-auto flex items-center gap-4">
            <DropdownMenu
              options={creationOptions}
              trigger={
                <button className="w-[32px] h-[32px] rounded-full border border-gray-200 py-2 border-solid items-center justify-center flex">
                  <PlusIcon />
                </button>
              }
              keyExtractor={(item) => item.id}
              renderItem={(item) => (
                <DropdownMenu.Item onClick={() => router.push(item.href)}>
                  {item.icon}
                  <span className="font-medium">{item.title}</span>
                </DropdownMenu.Item>
              )}
            />
            <DropdownMenu
              options={menuOptions}
              trigger={
                <button className="w-[32px] h-[32px] rounded-full border border-gray-200 py-2 border-solid items-center justify-center flex">
                  <MenuIcon />
                </button>
              }
              keyExtractor={(item) => item.id}
              renderItem={(item) => (
                <DropdownMenu.Item onClick={() => router.push(item.href)}>
                  <span className="font-medium">{item.title}</span>
                </DropdownMenu.Item>
              )}
            />
          </div>
        </div>
      </nav>
    </>
  );
};

export default Layout;
