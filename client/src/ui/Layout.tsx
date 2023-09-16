import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

interface Props {
  children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <Navigation />
      {children}
    </>
  );
};

const menuOptions = [
  { title: 'Profile', href: '', action: null },
  { title: 'Log out', href: '', action: null },
  { title: 'Login', href: '', action: null },
  { title: 'Theme', href: '', action: null },
];
const creationOptions = [
  { id: 'set', title: 'Create Set', href: '/create/set' },
  { id: 'folder', title: 'Create Folder', href: '/create/folder' },
];

const Navigation = () => {
  const router = useRouter();

  return (
    <>
      <nav className="py-[16px] border-b border-b-gray-200 bg-white sticky top-0">
        <div className="flex items-center max-w-3xl mx-auto px-4">
          <Link href="/">
            <a>{'Qsets </>'}</a>
          </Link>
          <div className="ml-auto flex items-center gap-2">
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="w-[32px] h-[32px] rounded-full border border-gray-200 py-2 border-solid items-center justify-center flex">
                  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" className="fill-gray-600">
                    <path d="M450.001-450.001h-230v-59.998h230v-230h59.998v230h230v59.998h-230v230h-59.998v-230Z" />
                  </svg>
                </button>
              </DropdownMenu.Trigger>

              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className="min-w-[220px] bg-white rounded-md p-2 shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
                  sideOffset={5}
                >
                  {creationOptions.map((item) => (
                    <DropdownMenu.Item
                      onClick={() => router.push(item.href)}
                      key={item.id}
                      className="flex gap-2 items-center p-3 cursor-pointer hover:bg-gray-100 rounded-md"
                    >
                      {item.id === 'set' ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="24"
                          viewBox="0 -960 960 960"
                          width="24"
                          className="fill-gray-600"
                        >
                          <path d="M170.004-194.618v-59.998h59.998v59.998h-59.998Zm0-139.998v-59.999H336.54v59.999H170.004Zm0-139.999v-59.999H440v59.999H170.004Zm0-139.999v-150.768h619.992v150.768H170.004Zm139.998 419.996v-59.998h59.999v59.998h-59.999Zm86.538-139.998v-59.999h166.536v59.999H396.54Zm53.461 139.998v-59.998h59.998v59.998h-59.998ZM520-474.615v-59.999h269.996v59.999H520Zm69.999 279.997v-59.998h59.999v59.998h-59.999Zm33.077-139.998v-59.999h166.92v59.999h-166.92Zm106.922 139.998v-59.998h59.998v59.998h-59.998Z" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="24"
                          viewBox="0 -960 960 960"
                          width="24"
                          className="fill-gray-600"
                        >
                          <path d="M570.001-330.001h59.998v-80h80v-59.998h-80v-80h-59.998v80h-80v59.998h80v80Zm-397.692 150q-30.308 0-51.308-21t-21-51.308v-455.382q0-30.308 21-51.308t51.308-21h219.613l80 80h315.769q30.308 0 51.308 21t21 51.308v375.382q0 30.308-21 51.308t-51.308 21H172.309Zm0-59.999h615.382q5.385 0 8.847-3.462 3.462-3.462 3.462-8.847v-375.382q0-5.385-3.462-8.847-3.462-3.462-8.847-3.462H447.385l-80-80H172.309q-5.385 0-8.847 3.462-3.462 3.462-3.462 8.847v455.382q0 5.385 3.462 8.847 3.462 3.462 8.847 3.462ZM160-240v-480 480Z" />
                        </svg>
                      )}
                      <span>{item.title}</span>
                    </DropdownMenu.Item>
                  ))}
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="w-[32px] h-[32px] rounded-full border border-gray-200 py-2 border-solid items-center justify-center flex">
                  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" className="fill-gray-600">
                    <path d="M140.001-254.616v-59.999h679.998v59.999H140.001Zm0-195.385v-59.998h679.998v59.998H140.001Zm0-195.384v-59.999h679.998v59.999H140.001Z" />
                  </svg>
                </button>
              </DropdownMenu.Trigger>

              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className="min-w-[220px] bg-white rounded-md p-2 shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
                  sideOffset={5}
                >
                  {menuOptions.map((item) => (
                    <DropdownMenu.Item
                      onClick={() => router.push(item.href)}
                      key={item.title}
                      className="flex gap-2 items-center p-3 cursor-pointer hover:bg-gray-100 rounded-md"
                    >
                      <span>{item.title}</span>
                    </DropdownMenu.Item>
                  ))}
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Layout;
