import Link from 'next/link';
import { useRouter } from 'next/router';

import { useLocalStore } from '@src/stores';
import { Button, Icons, DropdownMenu } from '@src/ui';

const creationOptions = [
  { id: 'set', title: 'Create Set', href: '/sets/new', icon: <Icons.Set /> },
  { id: 'folder', title: 'Create Folder', href: '/sets?folder=new', icon: <Icons.FolderPlus /> },
];

const Navigation = () => {
  const router = useRouter();
  const { userId, ...localStorage } = useLocalStore();

  const logout = () => {
    localStorage.setValues({ userId: undefined });
    router.push('/login');
  };

  const menuOptions = [
    { id: 'profile', title: 'Profile', action: () => router.push(`/user/${userId}`), icon: <Icons.Person /> },
    { id: 'logout', title: 'Log out', action: logout, icon: <Icons.Logout /> },
  ];

  return (
    <nav id="navigation" className="sticky top-0 z-10 border-b border-b-outline bg-surface py-[16px]">
      <div className="mx-auto flex max-w-3xl items-center px-4">
        <Link href="/" className="flex select-none items-center gap-1" aria-label="Project MWB logo, go to homepage">
          <span
            className="bg-gradient-to-br from-primary-500 to-[#111827] box-decoration-slice bg-clip-text font-semibold text-transparent"
            style={{ letterSpacing: '-0.9px', lineHeight: '0.8' }}
          >
            PROJECT MWB
          </span>
          <span className="rounded-lg bg-background px-1 text-xs font-medium text-[#6b7280]" style={{ letterSpacing: '-0.8px' }}>
            Prototype
          </span>
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <DropdownMenu
            options={creationOptions}
            trigger={
              <Button title="Create new.." shape="pill" data-testid="dropdown-create">
                <Icons.Plus />
              </Button>
            }
            keyExtractor={(item) => item.id}
            renderItem={(item) => (
              <DropdownMenu.Item
                onClick={() => router.push(item.href)}
                className="justify-between"
                data-testid={`dropdown-create-${item.id}`}
              >
                <span>{item.title}</span>
                {item.icon}
              </DropdownMenu.Item>
            )}
          />
          <DropdownMenu
            options={menuOptions}
            trigger={
              <Button title="Menu" shape="pill" data-testid="dropdown-menu">
                <Icons.Menu />
              </Button>
            }
            keyExtractor={(item) => item.id}
            renderItem={(item) => (
              <DropdownMenu.Item onClick={item.action} className="justify-between" data-testid={`dropdown-menu-${item.id}`}>
                <span>{item.title}</span>
                {item.icon}
              </DropdownMenu.Item>
            )}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
