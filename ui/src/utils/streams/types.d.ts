import { Mapping } from 'utils/fp';

import Subscription, { Subscriber } from './subscription';

export type Transformation<ExternalT, InternalT> = Mapping<
  Subscription<ExternalT>,
  Subscription<InternalT>
>;

export interface Stream<InternalT> {
  transform<ExternalT>(
    transformation: Transformation<ExternalT, InternalT>
  ): Stream<ExternalT>;

  subscribe(subscriber?: Subscriber<InternalT>): Subscription<InternalT>;

  getSubscriptions(): Subscription<InternalT>[];
}

export interface Subscriber<T> {
  next(v: T): void;
}
