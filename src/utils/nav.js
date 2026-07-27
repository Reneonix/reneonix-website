// Central client-side navigation helpers — replaces the old
// `window.location.hash = '#page'` approach now that routing uses real
// paths (History API) instead of URL fragments.
//
// pushState alone doesn't fire any event, so every place that needs to
// react to a route change (App.jsx's route state) listens for `popstate`;
// navigate() dispatches a synthetic PopStateEvent right after pushState so
// those listeners fire the same way they would for a real back/forward.

export function navigate(path) {
  if (window.location.pathname + window.location.search === path) return;
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

// Convenience for `<a href={path} onClick={navClick(path)}>` — stops the
// browser's default full-page navigation and routes client-side instead.
export function navClick(path) {
  return (e) => {
    e.preventDefault();
    navigate(path);
  };
}
