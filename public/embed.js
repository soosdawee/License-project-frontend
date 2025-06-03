(function () {
  const scriptTag = document.currentScript;
  const vizId = scriptTag.getAttribute('data-id') || '0';

  const iframe = document.createElement('iframe');
  iframe.src = `http://localhost:3000/visualization/${vizId}/embed`;
  iframe.width = '100%';
  iframe.height = '500';
  iframe.style.border = 'none';

  scriptTag.parentNode.insertBefore(iframe, scriptTag);
})();