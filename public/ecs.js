document.getElementById('showClustersBtn').addEventListener('click', async function() {

    if (clustersList.innerHTML !== '') {
        clustersList.innerHTML = '';
        return;
    }
    
    if (!selectedAccount) {
        alert('Please select an account first.');
        return;
    }
    
    try {
        const response = await fetch('/clusters', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        const clustersList = document.getElementById('clustersList');
        clustersList.innerHTML = '';

        data.clusters.forEach(clusterArn => {
            const clusterName = clusterArn.split('/').pop();
            const listItem = document.createElement('div');
            listItem.textContent = clusterName;

            listItem.addEventListener('click', function() {
                document.getElementById('clusterName').value = clusterName;

            });

            clustersList.appendChild(listItem);
        });

    } catch (error) {
        console.error('Error fetching ECS clusters:', error);
        document.getElementById('clustersList').textContent = 'Error fetching ECS clusters';
    }
});




document.getElementById('ecsForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const clusterName = document.getElementById('clusterName').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    if (!clusterName || !startDate || !endDate) {
        document.getElementById('maxCPU').textContent = 'Please fill out all fields.';
        return;
    }

    try {
        const response = await fetch('/cpu', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ clusterName, startDate, endDate })
        });


        const data = await response.json();
        const formattedMaxCPU = parseFloat(data.maxCPU).toFixed(2);
        document.getElementById('maxCPU').textContent = `${formattedMaxCPU}%`;

    } catch (error) {
        console.error('Error fetching CPU data:', error);
        document.getElementById('maxCPU').textContent = 'Max CPU Utilization: Error fetching data';
    }
});

