// Select the button and user container elements
const fetchUsersBtn = document.getElementById('fetchUsersBtn');
const usersContainer = document.getElementById('usersContainer');
const fetchHeroesBtn = document.getElementById('fetchHeroesBtn');
const note = document.getElementById('note');
const videoIframe = document.getElementById('videoIframe');
const fetchContainer = document.querySelector('.fetch');
// Function to fetch and display user data
function fetchAndDisplayUsers() {
 // Clear the container before fetching new data
 usersContainer.innerHTML = '';
 // Fetch data from the JSONPlaceholder API
 fetch('https://jsonplaceholder.typicode.com/users')
 .then(response => response.json())
 .then(users => {
 // Loop through the user data and create elements to display it
 users.forEach(user => {
 const userCard = document.createElement('div');
 userCard.className = 'user-card';
 fetchHeroesBtn.style.display = 'none';
                    fetchUsersBtn.style.display = 'none';
                    note.style.display = 'none';
                    videoIframe.style.display = 'none';
                    fetchContainer.classList.add('hidden'); 

 userCard.innerHTML = `
 <h3 style="color:orange;">${user.name}</h3>
 <p style="color:white;">Email: ${user.email}</p>
 <p style="color:white;">Phone: ${user.phone}</p>
 <p style="color:white;">Website: ${user.website}</p>
 <p style="color:white;">Company: ${user.company.name}</p>
 `;

 usersContainer.appendChild(userCard);
 });
 })
 .catch(error => {
 console.error('Error fetching user data:', error);
 usersContainer.innerHTML = '<p style="color:red;">Failed to fetch user data. Please try again later.</p>';
 });
}
// Attach the click event to the button
fetchUsersBtn.addEventListener('click', fetchAndDisplayUsers);