// =========================================================
// ALMA website script
// =========================================================

// 0) Playback speed: any <video data-speed="1.5"> plays at that speed.
//    Browsers reset the speed when a video (re)loads, so it is applied again then.
function applySpeed(video) {
  var speed = parseFloat(video.getAttribute('data-speed'));
  if (!speed) return;
  function set() { video.defaultPlaybackRate = speed; video.playbackRate = speed; }
  set();
  video.addEventListener('loadedmetadata', set);
  video.addEventListener('play', set);
}
document.querySelectorAll('video[data-speed]').forEach(applySpeed);

// 1) Full-screen logo intro.
//    Plays static/videos/logo.mp4 once per browser session, then fades out.
//    The <head> script in index.html decides whether to show it
//    (add ?intro to the URL to see it again while testing).
(function () {
  var html = document.documentElement;
  var intro = document.getElementById('intro');
  if (!intro) return;

  if (html.classList.contains('no-intro')) {
    intro.remove();
    return;
  }

  var video = intro.querySelector('video');
  var skipBtn = intro.querySelector('.intro-skip');
  var finished = false;
  var startTimer, maxTimer;

  function finish() {
    if (finished) return;
    finished = true;
    clearTimeout(startTimer);
    clearTimeout(maxTimer);
    try { sessionStorage.setItem('alma-intro-seen', '1'); } catch (e) {}
    intro.classList.add('is-done');
    html.classList.remove('intro-active');
    document.removeEventListener('keydown', onKey);
    setTimeout(function () { intro.remove(); }, 900);
  }
  function onKey(e) { if (e.key === 'Escape') finish(); }

  // Hold the last frame (the logo) for a moment before fading.
  video.addEventListener('ended', function () { setTimeout(finish, 500); });
  video.addEventListener('error', finish);
  skipBtn.addEventListener('click', finish);
  document.addEventListener('keydown', onKey);

  // If the video hasn't started within 4 s (slow connection, autoplay blocked), skip it.
  startTimer = setTimeout(finish, 4000);
  video.addEventListener('playing', function () {
    clearTimeout(startTimer);
    var remaining = (video.duration || 6) * 1000 / (video.playbackRate || 1) + 2500;
    maxTimer = setTimeout(finish, remaining);   // safety net if "ended" never fires
  });

  video.src = video.getAttribute('data-src');
  var playing = video.play();
  if (playing && playing.catch) playing.catch(finish);
})();

// 2) Demo videos: play (muted, looping) while on screen, pause when scrolled away.
//    Once someone uses the controls themselves, that video is left alone.
(function () {
  var videos = document.querySelectorAll('.demo-video');
  if (!videos.length) return;

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  videos.forEach(function (v) {
    v.muted = true;
    // Note when the visitor pauses/plays themselves (not when we do it).
    v.addEventListener('pause', function () { if (!v._autoAction) v._userControlled = true; v._autoAction = false; });
    v.addEventListener('play', function () { if (!v._autoAction) v._userControlled = true; v._autoAction = false; });
  });

  if (reduceMotion || !('IntersectionObserver' in window)) return;  // visitors press play themselves

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      var v = entry.target;
      if (v._userControlled) return;
      if (entry.isIntersecting && v.paused) {
        v._autoAction = true;
        var p = v.play();
        if (p && p.catch) p.catch(function () { v._autoAction = false; });
      } else if (!entry.isIntersecting && !v.paused) {
        v._autoAction = true;
        v.pause();
      }
    });
  }, { threshold: 0.4 });

  videos.forEach(function (v) { observer.observe(v); });
})();