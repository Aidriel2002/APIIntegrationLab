document.addEventListener('DOMContentLoaded', () => {
    const fetchUsersBtn = document.getElementById('fetchUsersBtn');
    const searchBtn = document.getElementById('searchBtn');
    const allRolesBtn = document.getElementById('allRolesBtn');
    const userContainer = document.getElementById('userContainer');
    const searchInput = document.getElementById('searchInput');
    const roleFilterContainer = document.getElementById('roleFilterContainer');
    const note = document.getElementById('note');
    const videoIframe = document.getElementById('videoIframe');
    const fetchContainer = document.querySelector('.fetch');

    // Modal Elements
    const userModal = document.getElementById('userModal');
    const modalImage = document.getElementById('modalImage');
    const modalName = document.getElementById('modalName');
    const modalRole = document.getElementById('modalRole');
    const modalSpecialty = document.getElementById('modalSpecialty');
    const closeModal = document.querySelector('.modal .close');

    let allUsers = [];
    let displayedUsers = [];

    function fetchUsers() {
        fetch('https://api.dazelpro.com/mobile-legends/hero')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.success && data.hero && Array.isArray(data.hero)) {
                    allUsers = data.hero;
                    populateRoleFilter(allUsers);
                    searchInput.style.display = 'block';
                    searchBtn.style.display = 'block';
                    roleFilterContainer.style.display = 'block';
                    allRolesBtn.style.display = 'block';
                    fetchUsersBtn.style.display = 'none';
                    note.style.display = 'none';
                    videoIframe.style.display = 'none';
                    fetchContainer.classList.add('hidden'); // Hide fetch container
                    filterUsers();
                } else {
                    throw new Error('Unexpected data format');
                }
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
                userContainer.innerHTML = `<p style="color:red;">Failed to fetch user data. Please try again later. ${error.message}</p>`;
            });
    }

    function populateRoleFilter(users) {
        const roles = new Set(users.flatMap(user => user.hero_role ? user.hero_role.split(',').map(role => role.trim()) : []));
        roleFilterContainer.innerHTML = '';

        roles.forEach(role => {
            const button = document.createElement('button');
            button.textContent = role;
            button.className = 'role-button';
            roleFilterContainer.appendChild(button);
        });

        setupRoleButtons();
    }

    function setupRoleButtons() {
        roleFilterContainer.querySelectorAll('.role-button').forEach(button => {
            button.addEventListener('click', () => {
                roleFilterContainer.querySelectorAll('.role-button').forEach(btn => {
                    btn.classList.remove('active');
                });
                button.classList.add('active');
                allRolesBtn.classList.remove('active');
                filterUsers();
            });
        });
    }

    function displayUsers(users) {
        userContainer.innerHTML = '';

        users.forEach((user, index) => {
            const userCard = document.createElement('div');
            userCard.className = 'user-card';
            const heroImageUrl = `images/${user.hero_id}.jpg`;

            userCard.innerHTML = `
                <img src="${heroImageUrl}" alt="${user.hero_name || 'Hero Image'}" class="user-image" data-index="${index}" />
                <h3>${user.hero_name || 'No Name'}</h3>
            `;

            userCard.querySelector('img').addEventListener('click', () => {
                showModal(user);
            });

            userContainer.appendChild(userCard);
        });
    }

    function filterUsers() {
        const query = searchInput.value.toLowerCase();
        const selectedRole = roleFilterContainer.querySelector('.role-button.active')?.textContent || '';

        displayedUsers = allUsers.filter(user => {
            const matchesName = user.hero_name.toLowerCase().includes(query);
            const userRoles = user.hero_role ? user.hero_role.split(',').map(role => role.trim()) : [];
            const matchesRole = selectedRole === '' || userRoles.includes(selectedRole);
            return matchesName && matchesRole;
        });

        displayUsers(displayedUsers);
    }

    function showModal(user) {
        modalImage.src = `images/${user.hero_id}.jpg`;
        modalName.textContent = user.hero_name || 'No Name';
        modalRole.innerHTML = `<span style="color: orange;">Role:</span> <span style="color: white;">${user.hero_role || 'N/A'}</span>`;
        modalSpecialty.innerHTML = `<span style="color: orange;">Specialty:</span> <span style="color: white;">${user.hero_specially || 'N/A'}</span>`;
        userModal.style.display = 'flex';

    }

    function hideModal() {
        userModal.style.display = 'none';
    }

    fetchUsersBtn.addEventListener('click', fetchUsers);
    searchBtn.addEventListener('click', filterUsers);
    searchInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            filterUsers();
        }
    });

    allRolesBtn.addEventListener('click', () => {
        roleFilterContainer.querySelectorAll('.role-button').forEach(btn => {
            btn.classList.remove('active');
        });
        allRolesBtn.classList.add('active');
        filterUsers();
    });

    closeModal.addEventListener('click', hideModal);
    window.addEventListener('click', (event) => {
        if (event.target === userModal) {
            hideModal();
        }
    });
});
