let selectedAccount = '';

function selectOption(option) {
    var selectOptionDiv = document.getElementById('selectedOption');

    if (option === '') {
        selectOptionDiv.textContent = 'No profile selected';
        selectedAccount = ''; 
        return;
    }

    if (option === 'default') {
        selectOptionDiv.textContent = 'Development';
    } else if (option === 'thrive_prod') {
        selectOptionDiv.textContent = 'Production';
    }

    selectedAccount = option;

    fetch('/setProfile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ profile: option })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Profile set to:', data.profile);
        
        document.getElementById('clustersList').innerHTML = '';
        document.getElementById('bucketList').innerHTML = '';
        document.getElementById('rdsList').innerHTML = '';
        document.getElementById('maxCPU').textContent = '';
    })
    .catch(error => {
        console.error('Error setting profile:', error);
    });
}

// Function to toggle the dropdown menu
function dropDown() {
    document.getElementById("myDropdown").classList.toggle("show");
}

// Function to hide dropdown menu when clicking outside of it
window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        for (var i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}
