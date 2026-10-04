/** Change just inviteeFont to select another installed or Google Fonts family. */
export const invitationConfig = {
  inviteeFont: 'Great Vibes',
  venueUrl: 'https://maps.app.goo.gl/9ZZcz9tto8mhHvDbA',
  brideName: 'Sarvatunnisa',
} as const;

export function getInviteeName(search: string): string {
  // URLSearchParams decodes percent escapes and '+' exactly once. React escapes output.
  return (new URLSearchParams(search).get('name') ?? '').trim()
    .replace(/(^|\s)(\p{L})/gu, (_, space: string, letter: string) => space + letter.toLocaleUpperCase());
}

export function loadInviteeFont() {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(invitationConfig.inviteeFont).replace(/%20/g, '+')}&display=swap`;
  document.head.appendChild(link);
  return () => link.remove();
}
