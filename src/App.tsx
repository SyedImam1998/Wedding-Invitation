import { useEffect, useLayoutEffect, useReducer, useRef, useState } from 'react';
import gsap from 'gsap';
import { getInviteeName, invitationConfig, loadInviteeFont } from './config';
import { invitationReducer } from './machine';
import { OuterFace, BookCover } from './components/CardFaces';
import { EnglishPage, TeluguPage } from './components/InvitationPages';

export default function App() {
  const [state, dispatch] = useReducer(invitationReducer, 'CLOSED');
  const [closing, setClosing] = useState(false);
  const scene = useRef<HTMLDivElement>(null);
  const action = useRef<HTMLButtonElement>(null);
  const reading = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const keyboardInteraction = useRef(false);
  const name = getInviteeName(window.location.search);
  const open = state === 'BOOK_OPEN';
  const animated = state === 'OUTER_OPENING' || state === 'FLAP_OPENING' || state === 'CARD_REVEALING' || state === 'BOOK_OPENING' || closing;

  useEffect(loadInviteeFont, []);
  useLayoutEffect(() => {
    const element = scene.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      if (!entry.contentRect.width) return;
      element.style.setProperty('--mini-scale', String(entry.contentRect.width * .92 / 600));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  useLayoutEffect(() => {
    if (!scene.current) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const speed = reduced ? 0.01 : 1;
    const ctx = gsap.context(() => {
      if (state === 'CLOSED') {
        gsap.set('.card-object', { rotationY: 0 });
        gsap.set('.reverse-face', { display: 'none' });
        gsap.set('.outer-face', { display: 'block' });
        gsap.set('.outer-face', { rotationY: 0, autoAlpha: 1 });
        gsap.set('.outer-flap', { rotationX: 0 });
        gsap.set('.flap-shadow', { opacity: 0, scaleY: 1 });
        gsap.set('.flap-front', { '--fold-shade': 0 });
        gsap.set('.sleeve', { autoAlpha: 1 });
        gsap.set('.book', { yPercent: 0, scale: .94 });
        gsap.set('.hinged-cover', { rotationY: 0 });
        gsap.set('.scene-shadow', { scale: 1, opacity: .22 });
      }
      if (state === 'OUTER_OPENING') {
        gsap.timeline({ onComplete: () => dispatch('OUTER_DONE') })
          .to('.card-object', { rotationY: -180, duration: 1 * speed, ease: 'power2.inOut' })
          // Nested 3D flap faces need an explicit side swap at the edge-on position.
          .set('.reverse-face', { display: 'block' }, .5 * speed)
          .set('.outer-face', { display: 'none' }, .5 * speed)
          .to('.scene-shadow', { scale: 1, opacity: .22, duration: .3 * speed }, '<');
      }
      if (state === 'FLAP_OPENING') {
        gsap.timeline({ onComplete: () => dispatch('FLAP_DONE') })
          // Lift the free edge towards the viewer, then fold the paper back at its crease.
          .to('.outer-flap', { rotationX: 24, duration: .28 * speed, ease: 'power2.in' })
          .to('.flap-shadow', { opacity: .2, scaleY: .85, duration: .28 * speed }, '<')
          .to('.flap-front', { '--fold-shade': .12, duration: .28 * speed }, '<')
          .to('.outer-flap', { rotationX: 178, duration: .9 * speed, ease: 'power2.inOut' })
          .to('.flap-shadow', { opacity: 0, scaleY: .05, duration: .55 * speed, ease: 'power2.in' }, '<')
          .to('.scene-shadow', { scale: 1.05, opacity: .18, duration: .9 * speed }, '<');
      }
      if (state === 'CARD_REVEALING') {
        gsap.timeline({ onComplete: () => { busy.current = false; dispatch('CARD_DONE'); } })
          .to('.book', { yPercent: -58, duration: .85 * speed, ease: 'power2.inOut' })
          .to('.sleeve', { autoAlpha: 0, duration: .4 * speed }, '-=.22')
          .to('.book', { yPercent: 0, scale: 1, duration: .55 * speed, ease: 'power2.out' });
      }
      if (state === 'BOOK_OPENING') {
        gsap.timeline({ onComplete: () => { busy.current = false; dispatch('BOOK_DONE'); } })
          .to('.hinged-cover', { rotationY: -160, duration: 1 * speed, ease: 'power2.inOut' })
          .to('.scene-shadow', { scaleX: 1.8, opacity: .1, duration: 1 * speed }, '<');
      }
    }, scene);
    // Kill animations on dependency change; final transforms persist for the next stage.
    return () => ctx.kill();
  }, [state]);

  useLayoutEffect(() => {
    if (!closing || !scene.current) return;
    const speed = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? .01 : 1;
    const ctx = gsap.context(() => {
      gsap.timeline({ onComplete: () => {
        setClosing(false); busy.current = false; dispatch('RESET');
        requestAnimationFrame(() => { action.current?.focus(); window.scrollTo(0, 0); });
      } })
        .to('.hinged-cover', { rotationY: 0, duration: .75 * speed, ease: 'power2.inOut' })
        .to('.book', { yPercent: -58, scale: .94, duration: .5 * speed, ease: 'power2.inOut' })
        .to('.sleeve', { autoAlpha: 1, duration: .3 * speed }, '<60%')
        .to('.book', { yPercent: 0, duration: .65 * speed, ease: 'power2.inOut' })
        .to('.outer-flap', { rotationX: 0, duration: .65 * speed, ease: 'power2.inOut' })
        .to('.flap-front', { '--fold-shade': 0, duration: .65 * speed }, '<')
        .addLabel('flipFront')
        .to('.card-object', { rotationY: 0, duration: 1 * speed, ease: 'power2.inOut' })
        .set('.reverse-face', { display: 'none' }, `flipFront+=${.5 * speed}`)
        .set('.outer-face', { display: 'block' }, `flipFront+=${.5 * speed}`)
        .to('.scene-shadow', { scale: 1, opacity: .22, duration: .5 * speed }, '<');
    }, scene);
    return () => ctx.kill();
  }, [closing]);

  useEffect(() => {
    if (open) {
      reading.current?.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: 'instant' });
    } else if (state === 'INNER_REVEALED' && keyboardInteraction.current) action.current?.focus({ preventScroll: true });
  }, [open, state]);

  function advance(keyboard = false) {
    if (busy.current || animated) return;
    keyboardInteraction.current = keyboard;
    busy.current = true;
    if (state === 'CLOSED') dispatch('OPEN_OUTER');
    else if (state === 'INNER_REVEALED') dispatch('OPEN_BOOK');
    else busy.current = false;
  }

  function reset() {
    if (busy.current) return;
    busy.current = true;
    setClosing(true);
  }

  return <main className={open ? 'experience is-open' : 'experience'} data-state={state}>
    <div className="scene-section" hidden={open && !closing}>
      <div className="scene" ref={scene}>
        <div className="scene-shadow" />
        <div className="card-object" aria-hidden="true">
          <div className="reverse-face">
          <div className="sleeve">
            <div className="sleeve-back paper" />
          </div>
          <div className="book">
            <div className="book-under paper"><div className="miniature-page"><TeluguPage /></div></div>
            <div className="hinged-cover"><div className="cover-front"><BookCover /></div><div className="cover-back paper"><div className="miniature-page"><EnglishPage /></div></div></div>
          </div>
          <div className="sleeve sleeve-pocket"><div className="pocket paper" /><div className="side-tab left paper" /><div className="side-tab right paper" /></div>
          <div className="sleeve sleeve-lid">
            <div className="flap-shadow" />
            <div className="outer-flap"><div className="flap-front paper" /><div className="flap-back paper" /></div>
          </div>
          </div>
          <div className="outer-face"><OuterFace name={name} /></div>
        </div>
        <button ref={action} className="scene-trigger" onClick={e => advance(e.detail === 0)} disabled={animated}
          aria-label={state === 'CLOSED' ? 'Flip the invitation and reveal the card from its envelope' : 'Open the card to read the marriage details'} />
      </div>
      <p className="interaction-hint" aria-live="polite">{closing ? 'Closing…' : state === 'CLOSED' ? 'Tap to open' : state === 'INNER_REVEALED' ? 'Tap the card to open' : state === 'OUTER_OPENING' ? 'Turning…' : state === 'FLAP_OPENING' ? 'Opening…' : state === 'CARD_REVEALING' ? 'Revealing…' : 'Unfolding…'}</p>
    </div>
    {open && <div className="reading" ref={reading} tabIndex={-1} hidden={closing}>
      <div className="book-spread"><EnglishPage /><TeluguPage /></div>
      <div className="reading-actions"><a className="venue-link" href={invitationConfig.venueUrl} target="_blank" rel="noopener noreferrer">Venue location</a><button className="close-button" onClick={reset} disabled={closing} aria-label="Close invitation and return to the outer card">Close invitation</button></div>
    </div>}
    <span className="sr-only" role="status">{state === 'BOOK_OPEN' ? 'Invitation open. English and Telugu pages are ready to read.' : ''}</span>
  </main>;
}
