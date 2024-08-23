document.getElementById('showBuckets').addEventListener('click', async function() {

    if (bucketList.innerHTML !== '') {
        bucketList.innerHTML = '';
        return;
    }

    if (!selectedAccount) {
        alert('Please select an account first.');
        return;
    }

    try {
        const response = await fetch('/buckets', {
            method:'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        
        })

        const data = await response.json()
        const bucketList = document.getElementById('bucketList')
        bucketList.innerHTML = ''
        data.buckets.forEach(buckets => {
            const listBucket = document.createElement('div')
            listBucket.textContent = buckets
            bucketList.appendChild(listBucket) 
        })

    } catch (error) {
        console.error('Error:', error);
        document.getElementById('bucketList').textContent = 'Error fetching S3 buckets';
    }
})