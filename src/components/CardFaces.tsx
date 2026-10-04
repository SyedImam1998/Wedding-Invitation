import { useLayoutEffect, useRef } from 'react';
import { invitationConfig } from '../config';
import { Bismillah, Flourish } from './Artwork';

export function OuterFace({ name }: { name: string }) {
  const title = useRef<SVGTextElement>(null);
  const invitee = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const fit = () => {
      if (title.current) {
        title.current.style.fontSize = '52px';
        const length = title.current.getComputedTextLength();
        if (length > 490) title.current.style.fontSize = `${52 * 490 / length}px`;
      }
      const field = invitee.current;
      if (field) {
        let size = 34;
        field.style.fontSize = `${size}px`;
        while ((field.scrollHeight > field.clientHeight || field.scrollWidth > field.clientWidth) && size > 12) field.style.fontSize = `${--size}px`;
      }
    };
    fit();
    let active = true;
    document.fonts.ready.then(() => { if (active) fit(); });
    document.fonts.addEventListener('loadingdone', fit);
    return () => { active = false; document.fonts.removeEventListener('loadingdone', fit); };
  }, [name]);
  const font = {fontFamily:`'${invitationConfig.inviteeFont}', cursive`};
  return <div className="address-face paper">
    <div className="outer-canvas">
      <svg className="front-plate" viewBox="0 0 600 816" preserveAspectRatio="xMidYMid meet" role="img" aria-label={`Wedding Invitation. Imam Weds ${invitationConfig.brideName}. To Mr. & Mrs. ${name}`}>
        <image href="./artwork/outer-stationery.png" width="600" height="816" preserveAspectRatio="none" aria-hidden="true" />
        <g data-region="header">
          <text ref={title} className="front-title" x="300" y="154" textAnchor="middle">Wedding Invitation</text>
        </g>
        <g data-region="couple" className="front-couple" textAnchor="middle">
          <text x="122" y="295">Imam</text><text className="front-weds" x="122" y="321">Weds</text><text x="122" y="350">{invitationConfig.brideName}</text>
        </g>
        <g data-region="recipient">
          <text className="front-label" x="180" y="444">To</text>
          <text className="front-label" x="180" y="463">Mr. &amp; Mrs.</text>
          <path d="M240 468H530M240 502H530M240 535H530" fill="none" stroke="#797348" strokeWidth=".85"/>
          <foreignObject x="240" y="432" width="290" height="110">
            <div ref={invitee} className="invitee invitee-name" style={font}>{name}</div>
          </foreignObject>
        </g>
        <g data-region="sender" className="front-sender">
          <text className="front-from" x="55" y="641">From :</text>
          <text className="front-sender-person" x="55" y="668">Mr. Syed Abdullah</text>
          <text className="front-sender-person" x="55" y="694">Mrs. Mohammed Zakirunnisa</text>
          <text x="55" y="718">Rajeswari Enclave, GF-A3,</text>
          <text x="55" y="737">Brundavan Colony, Near Sindhu Bhawan,</text>
          <text x="55" y="756">Labbipet, Vijayawada-10.</text>
          <text x="55" y="775">Cell : 9704184786, 9963065439</text>
        </g>
      </svg>
    </div>
  </div>;
}

export function BookCover() {
  return <div className="book-cover paper">
    <img className="floral-border" src="./artwork/floral-frame.png" alt="" />
    <div className="cover-oval"><div className="lattice" /></div>
    <div className="cover-medallion"><Bismillah seal emblem /></div>
    <div className="cover-name"><Flourish /><div>Imam <small>Weds</small> {invitationConfig.brideName}</div><Flourish /></div>
  </div>;
}
