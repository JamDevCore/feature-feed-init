import build from './build';

const styles = `
.nff-overlay {
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(17, 103, 250, 0.5);
  width: 100%;
  height: 100%;
  z-index: 10000;
  animation: appear 0.1s;
}

.nff-container {
  border: none;
  position: fixed;
  right: 0;
  top: 0;
  width: 324px;
  background: transparent;
  height: 100vh;
  z-index: 1001;
}

@media(min-width: 420px) {
.nff-container {
    width: 400px;
  }
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
      if(e.origin === 'https://feature-feed.netlify.com') {
        var task = e.data['task'];
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
    try {
      var feedButtons = document.getElementsByClassName('nff-init');
      feedButtons = Array.from(feedButtons)
      if (!feedButtons[0]) throw new Error('No ID found: Add the id => nff-init <= to a button');
      var key = feedButtons[0].getAttribute('data-airtable-key');
      var base = feedButtons[0].getAttribute('data-airtable-base');
      var table = feedButtons[0].getAttribute('data-airtable-table');
      var origin = window.location.href;
      if (!key || !base || !table) throw new Error('Please add config data to the script tag');
      initStyles();
      feedButtons.forEach((button) => {
        button.addEventListener('click', function () {
        showNewFeatureFeed(key, base, table, origin);
      });
    })
  } catch (exception) {
    console.log(exception);
  }
}());
