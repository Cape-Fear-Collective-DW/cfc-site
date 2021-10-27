/** */
export function toggleSearch() {

  return function(dispatch, getStore) {

    const oldValue = getStore().searchVisible;
    const newValue = !oldValue;

    dispatch({type: "SEARCH_TOGGLE", data: newValue});

    // focus the search input if visible
    if (document && newValue) {
      setTimeout(() => {
        const elem = document.querySelector(".global-search .cp-input");
        if (elem) elem.focus();
      }, 300);
    }

  };

}
