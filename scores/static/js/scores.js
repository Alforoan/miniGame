const navbarBtn = document.querySelector('.navbar-btn');
const navbar = document.querySelector('.navbar');
const unreadMessageCount = document.getElementById('unread-message-counter');
const urlToChange = 'http://127.0.0.1:8000';
navbarBtn.addEventListener('click', function () {
  navbar.classList.toggle('navbar-show');
});

async function getUnreadMessageCounter() {
  try {
    const response = await fetch(
      `${urlToChange}/recall_it/fetch_unread_message_count/`
    );
    if (!response.ok) {
      throw new Error('Network response was not ok' + response.statusText);
    }
    const data = await response.json();
    let unread_message_count = data.unread_message_count;
    if (unread_message_count > 0) {
      unreadMessageCount.textContent = unread_message_count;
    } else {
      unreadMessageCount.style.display = 'none';
    }
    console.log('UNREAD MESSAGES COUNT ', data);
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
  }
}

getUnreadMessageCounter();
setInterval(() => {
  getUnreadMessageCounter();
}, 30000);