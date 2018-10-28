import { ReplayStream } from 'utils/streams';

export default function Store({ initialState }) {
  let currentState = initialState;

  let currentStateStream = ReplayStream({
    initialValue: initialState,
    bufferSize: 1,
  });

  return {
    setState: (newState) => {
      currentState = newState;
      currentStateStream.next(newState);
    },

    getState: () => currentState,

    stateStream: () => currentStateStream.asReadOnly(),
  };
}
