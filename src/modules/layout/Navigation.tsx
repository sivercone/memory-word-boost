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
  const { user, ...localStorage } = useLocalStore();

  const logout = () => {
    localStorage.setValues({ user: undefined });
    router.push('/login');
  };

  const menuOptions = [
    { id: 'profile', title: 'Profile', action: () => router.push(`/user/${user?.id}`), icon: <Icons.Person /> },
    { id: 'logout', title: 'Log out', action: logout, icon: <Icons.Logout /> },
  ];

  return (
    <nav id="navigation" className="py-[16px] border-b border-b-outline bg-surface sticky top-0 z-10">
      <div className="flex items-center max-w-3xl mx-auto px-4">
        <Link href="/" className="flex gap-1 items-center select-none" legacyBehavior={false}>
          <span
            className="font-semibold bg-gradient-to-br from-primary-500 to-[#111827] box-decoration-slice bg-clip-text text-transparent"
            style={{ letterSpacing: '-0.9px', lineHeight: '0.8' }}
          >
            PROJECT MWB
          </span>
          <span className="bg-background text-xs font-medium rounded-lg px-1 text-[#6b7280]" style={{ letterSpacing: '-0.8px' }}>
            Prototype
          </span>
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <DropdownMenu
            options={creationOptions}
            trigger={
              <Button title="Create new.." shape="pill">
                <Icons.Plus />
              </Button>
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
              <Button title="Menu" shape="pill">
                <Icons.Menu />
              </Button>
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
  );
};

export default Navigation;
