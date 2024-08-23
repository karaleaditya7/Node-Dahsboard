document.getElementById('showRDS').addEventListener('click', async function(){

    if (rdsList.innerHTML !== '') {
        rdsList.innerHTML = '';
        return;
    }

    if (!selectedAccount) {
        alert('Please select an account first.');
        return;
    }

    try{
        const response = await fetch('/rds',{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const data = await response.json()
        const rdsInstanceList = document.getElementById('rdsList')
        rdsInstanceList.innerHTML = ''

        data.rds.forEach(rdsList => {
            const listItem = document.createElement('div')
            listItem.textContent = rdsList
            rdsInstanceList.appendChild(listItem)
            
        });
    } catch (error){
        console.error('Error', error)
        document.getElementById('rdsList').textContent = 'Error fetching RDS clusters'
    }


})