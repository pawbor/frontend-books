import { Mapping } from 'utils/fp/types';

import Subscription from './subscription';
import Notifier from './notifier';

export type Transformation<ExternalT, InternalT> = Mapping<
  SubscriptionLike<ExternalT>,
  Subscription<InternalT>
>;

export interface Stream<InternalT> {
  transform<ExternalT>(
    transformation: Transformation<ExternalT, InternalT>
  ): Stream<ExternalT>;

  subscribe(subscriber?: SubscriptionLike<InternalT>): Subscription<InternalT>;

  getSubscriptions(): Subscription<InternalT>[];
}

export interface Subscriber<T> {
  next(v: T): void;
}

export type SubscriptionLike<T> = Subscriber<T> | Subscription<T>;
