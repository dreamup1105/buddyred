import type { MutableRefObject } from 'react';

export type ActionRef = MutableRefObject<
  ActionType | undefined | ((actionType: ActionType) => void)
>;

export type ActionType = {
  restart: () => void;
  stop: () => void;
};
