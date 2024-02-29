const express = require('express');
const { exec } = require('child_process');
const app = express();
const port = process.env.PORT || 8080;

app.get('/', (req, res) => {
    const command = "curl -s https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html | grep -oP '(?<=<code class=\"code\">)[^<]+' | awk '/RUNTIME_IDENTIFIER/{flag=1; next} flag' | awk '/--function-version ALL/{flag=2; next} flag' | awk '/us-east-1/{flag=2; next} flag'";
    
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).json({ error: `exec error: ${error.message}` });
        }
        const runtimes = stdout.split('\n').filter(line => line.trim() !== '');
        res.json({ "deprecated_runtimes": runtimes });
    });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
