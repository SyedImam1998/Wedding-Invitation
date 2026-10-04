export function Bismillah({ seal = false, emblem = false }: { seal?: boolean; emblem?: boolean }) {
  return <span className={seal ? `bismillah seal${emblem ? ' calligraphy-emblem' : ''}` : 'bismillah'} lang="ar" dir="rtl" aria-label="بسم الله الرحمن الرحيم">{emblem ? <><img src="./artwork/bismillah.png" alt="" /><span className="sr-only">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span></> : seal ? <span>بِسْمِ اللَّهِ<br />الرَّحْمَٰنِ<br />الرَّحِيمِ</span> : 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ'}</span>;
}

export function Flourish({ className = '' }: { className?: string }) {
  return <span className={`flourish ${className}`} aria-hidden="true"><svg viewBox="0 0 180 40" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M90 30C73 30 66 14 76 9C85 4 94 15 87 19C80 23 78 13 82 13M90 30C107 30 114 14 104 9C95 4 86 15 93 19C100 23 102 13 98 13M75 24C58 31 41 16 50 8C59 1 72 12 65 17C58 22 52 12 57 11M105 24C122 31 139 16 130 8C121 1 108 12 115 17C122 22 128 12 123 11M48 20C31 25 22 12 29 8C36 4 40 13 35 14M132 20C149 25 158 12 151 8C144 4 140 13 145 14M26 16C16 10 7 22 15 23M154 16C164 10 173 22 165 23M90 27v9"/><path d="M85 31L90 37l5-6-5 2z" fill="currentColor"/></svg></span>;
}

export function Mosque({ crescent = false }: { crescent?: boolean }) {
  return <svg className="mosque" viewBox="0 0 100 90" aria-hidden="true" fill="currentColor">
    {crescent && <path d="M8 49Q22 89 65 73Q37 99 12 74Q5 62 8 49Z"/>}
    <path d="M25 46h47v26H25zM32 35q18-24 34 0v10H32zM48 19h3v9h-3zM16 21h6v51h-6zM14 19l5-12 5 12zM76 15h6v57h-6zM74 13l5-12 5 12z"/>
    <g fill="#f9f7f1"><path d="M30 51h3v8h-3zM39 51h3v8h-3zM48 51h3v8h-3zM57 51h3v8h-3zM65 51h3v8h-3zM43 65q6-12 12 0v7H43z"/></g>
    <path d="M23 75h52v2H23zM12 78h76v2H12z"/>
  </svg>;
}

export function PageFrame() {
  return <div className="page-frame" aria-hidden="true"><span>❦</span><span>❦</span><span>❦</span><span>❦</span></div>;
}
