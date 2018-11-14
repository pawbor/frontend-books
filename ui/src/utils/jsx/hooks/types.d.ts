import { VNode } from '../nodes/types';
import { CustomElement } from '../nodes';
import { StateHook } from './hook-state';
import EffectHook from './effect-hook';

export type Updater = () => void;

export type UpdateTarget = CustomElement;

export type HooksTarget = CustomElement;

export type HooksContext = {
  hooksTarget: HooksTarget;
  currentHooks: Hook[];
  previousHooks: Hook[];
};

export type HookCell = {
  previousHook: Hook | undefined;
};

export type Hook = StateHook<any> | EffectHook;

export type Effect = () => EffectCleanup | void;

export type EffectCleanup = Function;
