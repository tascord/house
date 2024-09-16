import { createRoot } from 'react-dom/client';
import { StrictMode, useEffect, useMemo, useState } from 'react';
import Quotes from './quotes/quotes.json';
import './index.css';

const load_quote = (s: string) => {
  return s.split('').map(c => ({ char: c, state: 'untyped' }));
}

const App = () => {

  const [progress, setProgress] = useState<{ char: string, state: 'typed' | 'untyped' | 'erroneous' }[]>();
  const [index, setIndex] = useState(0);
  const [wpm, setWpm] = useState(0);

  let typed = 0;
  let intervals = 0;
  setInterval(() => {
    setWpm(typed / 60 / intervals++);
  }, 1_000);

  const load = () => {
    setProgress(load_quote(Quotes[Math.floor(Math.random() * Quotes.length)]) as any);
  }

  useMemo(() => load(), []);
  

  useEffect(() => {

    if (typeof document === 'undefined') return;
    const handler = (e: KeyboardEvent) => {
      const target = (progress ?? [])[index];

      if (e.key.length == 1) typed++;

      // If you typed it wrong, insert a red character because you need to delete that
      if (e.key != target.char && e.key.length == 1) {
        setProgress([
          ...progress?.slice(0, index) ?? [],
          { char: e.key, state: 'erroneous' },
          ...progress?.slice(index) ?? []
        ]);

        setIndex(index + 1);
      }

      // Handle backspace
      else if (e.key === 'Backspace') {
        if ((progress ?? [])[index - 1].state == 'erroneous') {
          setProgress([
            ...progress?.slice(0, index - 1) ?? [],
            ...progress?.slice(index) ?? [],
          ]);
        } else {
          (progress ?? [])[index].state = 'untyped';
          setProgress(progress);
        }

        setIndex(Math.max(index - 1, 0));
      }

      // Is correct
      else if (e.key == target.char) {
        (progress ?? [])[index].state = 'typed';
        setProgress(progress);

        setIndex(index + 1);
      }

    }

    document.body.addEventListener('keydown', handler);
    return (() => { document.body.removeEventListener('keydown', handler); })

  }, [progress, index]);

  return (
    <main className='w-screen h-screen grid place-items-center bg-black' style={{
      backgroundImage: 'url("/house.jpg")',
      backgroundSize: '100px',
      backgroundBlendMode: 'hard-light',
    }}>
      <div className='max-w-xl font-mono font-bold text-lg'>
        <h1 className='text-pink-400 font-bold text-xl animate-ping'>HOUSEPOINTS = <strong>{wpm}</strong></h1>
        {
          progress?.map(c =>
            <span className={c.state === 'typed' ? 'text-cyan-200' : c.state === 'untyped' ? 'text-cyan-900' : 'text-red-800'}>{c.char}</span>
          )
        }
      </div>
    </main>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
