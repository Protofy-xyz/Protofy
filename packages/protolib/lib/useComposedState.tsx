import { useState } from "react";

export const useComposedState = (initialStates = {}) => {
  const [statesObj, setStatesObj] = useState(initialStates);

  const updateState = (key, value) => {
      setStatesObj(prevStates => ({
          ...prevStates,
          [key]: { value, set: newValue => updateState(key, newValue) }
      }));
  };

  const composedState : any = new Proxy({}, {
    get: function(target, prop) {
        if (statesObj[prop]) {
            return statesObj[prop];
        } else {
            const newState = { value: '', set: (val) => updateState(prop, val) };
            updateState(prop, newState.value);
            return newState;
        }
    }
});

  var states : any = Object.keys(statesObj).reduce((acc, key) => {
      return { ...acc, [key]: statesObj[key].value };
  }, {});

  return { cs: composedState, states };
};