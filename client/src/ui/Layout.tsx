import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMutation } from 'react-query';
import { FolderIcon, LogoutIcon, MenuIcon, PersonIcon, PlusIcon, SetIcon } from '@src/ui/Icons';
import { DropdownMenu, ButtonCircle } from '@src/ui';
import { useUserStore } from '@src/stores';
import { authApi } from '@src/apis';
import Head from 'next/head';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { pathname } = useRouter();

  return (
    <>
      <Head>{pathname !== '/login' && <meta name="theme-color" content={`#ffffff`} />}</Head>
      {pathname !== '/login' && <Navigation />}
      {children}
    </>
  );
};

const creationOptions = [
  { id: 'set', title: 'Create Set', href: '/sets/new', icon: <SetIcon /> },
  { id: 'folder', title: 'Create Folder', href: '/sets?folder=new', icon: <FolderIcon /> },
];

const Navigation = () => {
  const router = useRouter();
  const { user, setUser } = useUserStore();
  const logout = useMutation(authApi.logout, {
    onSuccess: () => {
      setUser(undefined);
      localStorage.setItem('logged', 'no');
      router.push('/login');
    },
  });

  const menuOptions = [
    { id: 'profile', title: 'Profile', action: () => router.push(`/user/${user?.id}`), icon: <PersonIcon /> },
    { id: 'logout', title: 'Log out', action: async () => await logout.mutateAsync(), icon: <LogoutIcon /> },
  ];

  return (
    <>
      <nav id="navigation" className="py-[16px] border-b border-b-gray-200 bg-white sticky top-0 z-10">
        <div className="flex items-center max-w-3xl mx-auto px-4">
          <Link href="/" className="flex gap-1 items-center select-none" legacyBehavior={false}>
            <span
              className="font-semibold bg-gradient-to-br from-violet-500 to-gray-900 box-decoration-slice bg-clip-text text-transparent"
              style={{ letterSpacing: '-0.9px', lineHeight: '0.8' }}
            >
              PROJECT MWB
            </span>
            <span className="bg-gray-100 text-xs font-medium rounded-lg px-1 text-gray-500" style={{ letterSpacing: '-0.8px' }}>
              Prototype
            </span>
          </Link>
          <div className="ml-auto flex items-center gap-4">
            <DropdownMenu
              options={creationOptions}
              trigger={
                <ButtonCircle title="Create new..">
                  <PlusIcon />
                </ButtonCircle>
              }
              keyExtractor={(item) => item.id}
              renderItem={(item) => (
                <DropdownMenu.Item onClick={() => router.push(item.href)} className="justify-between">
                  <span>{item.title}</span>
                  {item.icon}
                </DropdownMenu.Item>
              )}
            />
            <DropdownMenu
              options={menuOptions}
              trigger={
                <ButtonCircle title="Menu">
                  <MenuIcon />
                </ButtonCircle>
              }
              keyExtractor={(item) => item.id}
              renderItem={(item) => (
                <DropdownMenu.Item onClick={item.action} className="justify-between">
                  <span>{item.title}</span>
                  {item.icon}
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
