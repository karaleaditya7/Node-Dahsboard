require('dotenv').config();
const express = require('express');
const AWS = require('aws-sdk');
const moment = require('moment');
const path = require('path');
const session = require('express-session');

const cors = require('cors');


const app = express();
const port = 3001;

app.use(cors()); 

AWS.config.update({
    region: 'eu-west-1'
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Set profile
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}));

app.post('/setProfile', (req, res) => {
    const { profile } = req.body;
    req.session.profile = profile;
    res.json({ profile });
});

app.use((req, res, next) => {
    const profile = req.session.profile || 'default';
    AWS.config.credentials = new AWS.SharedIniFileCredentials({ profile });
    next();
});

// CloudWatch Metrics
const cloudwatch = new AWS.CloudWatch();

app.post('/cpu', async (req, res) => {
    const { clusterName, startDate, endDate } = req.body;

    if (!clusterName || !startDate || !endDate) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    const params = {
        EndTime: moment(endDate).toISOString(),
        StartTime: moment(startDate).toISOString(),
        MetricName: 'CPUUtilization',
        Namespace: 'AWS/ECS',
        Period: 300,
        Statistics: ['Maximum'],
        Dimensions: [
            {
                Name: 'ClusterName',
                Value: clusterName
            }
        ]
    };

    try {
        const data = await cloudwatch.getMetricStatistics(params).promise();

        let maxCPU = 0;

        if (data.Datapoints.length > 0) {
            maxCPU = Math.max(...data.Datapoints.map(point => point.Maximum));
        } else {
            console.log('No data points available for the given parameters.');
        }

        res.json({ maxCPU });

    } catch (error) {
        console.error('AWS Error:', error.message);
        console.error('AWS Error Details:', error);
        res.status(500).json({ error: 'Error fetching data from CloudWatch', details: error.message });
    }
});

// ECS Clusters
app.get('/clusters', async (req, res) => {
    const ecs = new AWS.ECS();
    
    try {
        const data = await ecs.listClusters().promise();
        const clusterArns = data.clusterArns;

        res.json({ clusters: clusterArns });
        
    } catch (error) {
        console.error('AWS Error:', error.message);
        console.error('AWS Error Details:', error);
        res.status(500).json({ error: 'Error fetching ECS clusters', details: error.message });
    }
});

// S3 Buckets
app.get('/buckets', async (req, res) => {
    const s3 = new AWS.S3();

    try {
        const data = await s3.listBuckets().promise();
        const s3buckets = data.Buckets.map(bucket => bucket.Name);

        res.json({ buckets: s3buckets });

    } catch (error) {
        console.error('AWS Error:', error.message);
        console.error('AWS Error Details:', error);
        res.status(500).json({ error: 'Error fetching S3 buckets', details: error.message });
    }
});

// RDS Instances
app.get('/rds', async (req, res) => {
    const rds = new AWS.RDS();

    try {
        const data = await rds.describeDBInstances().promise();
        const rdsInstances = data.DBInstances.map(instance => instance.DBInstanceIdentifier);

        res.json({ rds: rdsInstances });
    } catch (error) {
        console.error('AWS Error:', error.message);
        console.error('AWS Error Details:', error);
        res.status(500).json({ error: 'Error fetching RDS instances', details: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});



// =================================

