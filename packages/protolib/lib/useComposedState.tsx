import { useState } from "react";

export const useComposedState = (initialStates = {}) => {
  const [statesObj, setStatesObj] = useState(initialStates);

  const updateState = (key, value) => {
      setStatesObj(prevStates => ({
          ...prevStates,
          [key]: { value, set: newValue => updateState(key, newValue) }
      }));
  };

  const composedState = (key) => {
    if (statesObj[key]) {
      return statesObj[key];
    } else {
      const newState = { value: '', set: (val) => updateState(key, val) };
      updateState(key, newState.value);
      return newState;
    }
  };

  var states : any = Object.keys(statesObj).reduce((acc, key) => {
      return { ...acc, [key]: statesObj[key].value };
  }, {});

  return { composedState, states };
};