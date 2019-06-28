import build from './build';

const styles = `
.nff-overlay {
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(17, 103, 250, 0.5);
  width: 100%;
  height: 100%;
  z-index: 1000;
  animation: appear 0.1s;
}

.nff-container {
  border: none;
  position: fixed;
  right: 0;
  top: 0;
  background: transparent;
  width: 400px;
  height: 100vh;
  z-index: 1001;
}
`

let openState = false;

const initStyles = () => {
  const style = document.createElement('style')
  style.innerHTML = styles;
  document.querySelector('head').appendChild(style);
}

export const closeFeed = (event) => {
  try {
    openState = false;
    const body = document.querySelector('body');
    body.removeChild(document.querySelector('#nff-overlay-id'));
  } catch (exception) {
    console.log(exception);
  }
};


const showNewFeatureFeed = (key, base, table, origin) => {
  try {
    if (openState === false) {
    const overlay = build('div', [{ name: 'class', value: 'nff-overlay' }, { name: 'id', value: 'nff-overlay-id'}])
    overlay.addEventListener('click', closeFeed)
    const feedContainer = build('iframe', [
      { name: 'class', value: 'nff-container' },
      { name: 'id', value: 'nff-container-id' },
      { name: 'src', value: `https://feature-feed.netlify.com?apiKey=${key}&base=${base}&table=${table}&origin=${origin}`},
    ]);
    feedContainer.addEventListener('click', (event) => event.stopPropagation())
    const body = document.querySelector('body');
    body.append(overlay);
    window.addEventListener('message', (e) => {
      console.log(e.origin)
      if(e.origin === 'https://feature-feed.netlify.com') {
        var task = e.data['task'];
        console.log(task)
        if(task = 'close') closeFeed();
      }
    })
    overlay.append(feedContainer)
    openState = true;
  } else {
    closeFeed()
  }
  } catch (exception) {
    console.log(exception);
  }
}


(function initFeed() {
  window.onload = function() {
    try {
      const feedButton = document.querySelector('#nff-init');
      if(!feedButton) throw new Error('No ID found: Add the id => feature-feed-init <= to a button')
      const key = feedButton.getAttribute('data-airtable-key');
      const base = feedButton.getAttribute('data-airtable-base');
      const table = feedButton.getAttribute('data-airtable-table');
      const origin = window.location.href;
      if (!key || !base || !table) throw new Error('Please add config data to the script tag');
      initStyles()
      feedButton.addEventListener('click', () => {
        showNewFeatureFeed(key, base, table, origin)
      });
  } catch (exception) {
    console.log(exception);
  }
}
}());
