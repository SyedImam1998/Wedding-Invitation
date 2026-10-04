export type InvitationState = 'CLOSED' | 'OUTER_OPENING' | 'FLAP_OPENING' | 'CARD_REVEALING' | 'INNER_REVEALED' | 'BOOK_OPENING' | 'BOOK_OPEN';
export type InvitationEvent = 'OPEN_OUTER' | 'OUTER_DONE' | 'FLAP_DONE' | 'CARD_DONE' | 'OPEN_BOOK' | 'BOOK_DONE' | 'RESET';
const transitions: Partial<Record<InvitationState, Partial<Record<InvitationEvent, InvitationState>>>> = {
  CLOSED: { OPEN_OUTER: 'OUTER_OPENING' },
  OUTER_OPENING: { OUTER_DONE: 'FLAP_OPENING' },
  FLAP_OPENING: { FLAP_DONE: 'CARD_REVEALING' },
  CARD_REVEALING: { CARD_DONE: 'INNER_REVEALED' },
  INNER_REVEALED: { OPEN_BOOK: 'BOOK_OPENING' },
  BOOK_OPENING: { BOOK_DONE: 'BOOK_OPEN' },
  BOOK_OPEN: { RESET: 'CLOSED' },
};
export function invitationReducer(state: InvitationState, event: InvitationEvent): InvitationState {
  return transitions[state]?.[event] ?? state;
}
