const hero = document.querySelector('.hero');
const video = hero?.querySelector('.hero-video');
const button = hero?.querySelector('.hero-motion');

if (video && button) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let pausedByUser = false;
  let visible = true;
  let failed = false;
  let pending = false;
  let intentVersion = 0;
  const shouldPlay = () => !reduced.matches && !pausedByUser && visible && !document.hidden && !failed;

  function label() {
    const text = pausedByUser || video.paused ? 'Play background' : 'Pause background';
    button.textContent = text;
    button.setAttribute('aria-label', `${text} animation`);
  }

  async function update() {
    button.hidden = reduced.matches || failed;
    if (!shouldPlay()) {
      intentVersion += 1;
      video.pause();
      if (reduced.matches || failed) video.classList.remove('is-playing');
      label();
      return;
    }
    if (pending) return;
    if (!video.hasAttribute('src')) video.src = video.dataset.src;
    video.muted = true;
    pending = true;
    const startedVersion = intentVersion;
    try {
      await video.play();
      if (!shouldPlay()) video.pause();
    } catch {
      // Leave the photograph visible when autoplay is blocked; allow a click to retry.
      if (startedVersion === intentVersion && shouldPlay()) pausedByUser = true;
    } finally {
      pending = false;
      label();
      if (startedVersion !== intentVersion && shouldPlay() && video.paused) update();
    }
  }

  button.addEventListener('click', () => {
    pausedByUser = !pausedByUser;
    update();
  });
  video.addEventListener('playing', () => {
    if (shouldPlay()) video.classList.add('is-playing');
    else {
      video.pause();
      if (reduced.matches || failed) video.classList.remove('is-playing');
    }
    label();
  });
  video.addEventListener('pause', label);
  video.addEventListener('error', () => {
    failed = true;
    update();
  });
  reduced.addEventListener('change', update);
  document.addEventListener('visibilitychange', update);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    }).observe(hero);
  } else {
    update();
  }
}
