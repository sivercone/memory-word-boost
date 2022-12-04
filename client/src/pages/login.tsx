import { NextPage } from 'next';
import Link from 'next/link';
import style from 'styles/pages/login.module.scss';
import { sessionMemory } from 'lib/browserMemory';
import { isBackendLess } from 'lib/staticData';

const login: NextPage = () => {
  const resetLoggedState = () => sessionMemory.remove('logged');

  return (
    <main className={style.container}>
      <section className={style.subject}>
        <h1>MEMORY WORD BOOST</h1>
        <p>Helps fast learning and memorizing anything</p>
        {isBackendLess ? (
          <Link href="/">
            <a>
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16">
                <path
                  fillRule="evenodd"
                  d="M3.112 5.112a3.125 3.125 0 0 0-.17.613C1.266 6.095 0 7.555 0 9.318 0 11.366 1.708 13 3.781 13H11L3.112 5.112zm11.372 7.372L4.937 2.937A5.512 5.512 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773a3.2 3.2 0 0 1-1.516 2.711zm-.838 1.87-12-12 .708-.708 12 12-.707.707z"
                />
              </svg>
              <span>Log in local mode</span>
            </a>
          </Link>
        ) : (
          <a
            onClick={resetLoggedState}
            href="https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=http://localhost:7001/auth/google&client_id=448140364075-r8rpsud12emg41od7cilo6u9bcavkflh.apps.googleusercontent.com&access_type=offline&response_type=code&prompt=consent&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16">
              <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z" />
            </svg>
            <span>Log in with Google</span>
          </a>
        )}
      </section>
      {/* @todo - add screenshots, gifs, videos of process studying with app */}
      <section className={style.cards}>
        <ul>
          <li>
            <p>4</p>
            <p>Variants of study methods</p>
          </li>
          <li>
            <p>Dark Theme</p>
            <p>Have comfort during night studies</p>
          </li>
          <li>
            <p>PWA</p>
            <p>Shortcut on the screen that imitates a standard native application</p>
          </li>
          <li>
            <p>No ADS</p>
            <p>Totally free</p>
          </li>
        </ul>
      </section>
      <section className={style.opensource}>
        <h2>Open-source</h2>
        <p>Source code is available on GitHub - feel free to read, review, or contribute to it however you want!</p>
        <a href="https://github.com/sivercone/memory-word-boost" target="_blank" rel="noreferrer">
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
          </svg>
          <span>GitHub</span>
        </a>
      </section>
    </main>
  );
};

export default login;
