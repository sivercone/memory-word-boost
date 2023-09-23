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
  { id: 'set', title: 'Create Set', href: '/create/set', icon: <SetIcon /> },
  { id: 'folder', title: 'Create Folder', href: '/create/folder', icon: <FolderIcon /> },
];

const Navigation = () => {
  const router = useRouter();

  return (
    <>
      <nav className="py-[16px] border-b border-b-gray-200 bg-white sticky top-0">
        <div className="flex items-center max-w-3xl mx-auto px-4">
          <Link href="/">
            <a className="font-semibold">PROJECT MWB</a>
          </Link>
          <div className="ml-auto flex items-center gap-2">
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
                  <span>{item.title}</span>
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
                  <span>{item.title}</span>
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
