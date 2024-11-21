import { type Signal, signal } from '@preact/signals';

// Not every popup option belongs here. This is really just for cross-cutting
// options that we want to be able to toggle from the Cosmos UI.

type PopupOptions = {
  interactive: Signal<boolean>;
};

export const popupOptions: PopupOptions = {
  interactive: signal(true),
};
