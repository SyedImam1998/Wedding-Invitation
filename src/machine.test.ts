import { describe, expect, it } from 'vitest';
import { getInviteeName } from './config';
import { invitationReducer, type InvitationState } from './machine';
describe('invitation interaction state machine', () => {
  it('permits the physical sequence and rejects out of order input', () => {
    let state: InvitationState = 'CLOSED';
    expect(invitationReducer(state, 'OPEN_BOOK')).toBe('CLOSED');
    for (const event of ['OPEN_OUTER','OUTER_DONE','FLAP_DONE','CARD_DONE','OPEN_BOOK','BOOK_DONE'] as const) state = invitationReducer(state,event);
    expect(state).toBe('BOOK_OPEN');
    expect(invitationReducer(state,'RESET')).toBe('CLOSED');
  });
  it('ignores repeated taps during opening', () => {
    expect(invitationReducer('OUTER_OPENING','OPEN_OUTER')).toBe('OUTER_OPENING');
    expect(invitationReducer('BOOK_OPENING','OPEN_BOOK')).toBe('BOOK_OPENING');
  });
});
describe('personalization', () => {
  it('decodes pluses, Unicode and percent escapes once', () => {
    expect(getInviteeName('?name=Syed+Abdullah+Family')).toBe('Syed Abdullah Family');
    expect(getInviteeName('?name=%E0%B0%87%E0%B0%AE%E0%B0%BE%E0%B0%AE%E0%B1%8D')).toBe('ఇమామ్');
    expect(getInviteeName('?name=A%2520B')).toBe('A%20B');
  });
  it('keeps text as text and defaults to blank', () => {
    expect(getInviteeName('?name=%3Cscript%3E')).toBe('<script>');
    expect(getInviteeName('')).toBe('');
    expect(getInviteeName('?name=+++')).toBe('');
  });
});
