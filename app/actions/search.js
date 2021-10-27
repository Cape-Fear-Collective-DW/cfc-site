/** */
export function toggleSearch() {

  return function(dispatch, getStore) {

    const oldValue = getStore().searchVisible;
    const newValue = !oldValue;

    dispatch({type: "SEARCH_TOGGLE", data: newValue});

  };

}
