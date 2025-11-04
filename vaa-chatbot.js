(function () {
  // Create chatbot button
  const chatBtn = document.createElement('button');
  chatBtn.id = 'vaaChatBtn';
  chatBtn.innerHTML = '<i style="font-size:20px" class="fa fa-comments"></i>';
  Object.assign(chatBtn.style, {
    position: 'fixed',
    bottom: '25px',
    right: '25px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '50%',
    width: '55px',
    height: '55px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 3px 10px rgba(0,0,0,0.3)',
    zIndex: '9999',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  });

  chatBtn.addEventListener('mouseenter', () => chatBtn.style.backgroundColor = '#0056b3');
  chatBtn.addEventListener('mouseleave', () => chatBtn.style.backgroundColor = '#007bff');

  // Create chatbot popup
  const chatBox = document.createElement('div');
  chatBox.id = 'vaaChatBox';
  Object.assign(chatBox.style, {
    display: 'none',
    position: 'fixed',
    bottom: '90px',
    right: '25px',
    width: '360px',
    height: '500px',
    background: '#fff',
    borderRadius: '10px',
    boxShadow: '0 5px 20px rgba(0,0,0,0.3)',
    overflow: 'hidden',
    zIndex: '10000',
  });

  // Header
  const header = document.createElement('div');
  header.style.background = '#007bff';
  header.style.color = '#fff';
  header.style.padding = '10px 15px';
  header.style.display = 'flex';
  header.style.justifyContent = 'space-between';
  header.style.alignItems = 'center';
  header.style.fontWeight = '500';
  header.innerHTML = `
    <span>VAA Chatbot</span>
    <button id="vaaCloseBtn" style="background:none;border:none;color:white;font-size:20px;cursor:pointer;">&times;</button>
  `;

  // Chat iframe
  const iframe = document.createElement('iframe');
  iframe.src = 'https://vaa-official.github.io/script/';
  Object.assign(iframe.style, {
    width: '100%',
    height: 'calc(100% - 45px)',
    border: 'none'
  });

  chatBox.appendChild(header);
  chatBox.appendChild(iframe);

  // Add to page
  document.body.appendChild(chatBtn);
  document.body.appendChild(chatBox);

  // Button actions
  chatBtn.addEventListener('click', () => {
    chatBox.style.display = 'block';
  });
  header.querySelector('#vaaCloseBtn').addEventListener('click', () => {
    chatBox.style.display = 'none';
  });
})();
