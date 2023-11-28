const express = require('express');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const app = express();
const port = 3000;



app.use(cookieParser());

const secretKey = '2w9lHeqHMTVr-kouYVezAxEK9uc0lY-HXitbzgUuSnY';

app.get('/generateToken', (req, res) => {
    // Payload data you want to include in the token
    const payload = {
        role: 'user',
        username: 'ctfer',
    };

    // Generate the token
    const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

    // Set the token as a cookie
    res.cookie('jwt', token, { maxAge: 3600000 });

    // Redirect to the protected page
    res.redirect('/protectedPage');
});

// Middleware to verify the JWT and display the protected content
app.get('/protectedPage', (req, res) => {
    // Check if the JWT exists in the request
    const token = req.cookies.jwt;
    if (!token) {
        return res.redirect('/');
    }

    let flag

    // Verify and decode the token
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.redirect('/');
        }

        // If the token is valid, display the protected content
        const roleResponse = decoded.role === 'admin' ? 'yes' : 'no';

        if(roleResponse === "yes"){
            flag = "????????????????????????????????????"
        }else{
            flag = "NO permisssion!"
        }

        res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Protected Page</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
        }

        h1 {
            color: #333;
        }

        p {
            margin: 8px 0;
            color: #666;
        }

        .container {
            max-width: 400px;
            text-align: center;
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Can You Find My Secret?</h1>
        <p>User ID: ${decoded.role}</p>
        <p>Username: ${decoded.username}</p>
        <p>FLAG: ${flag}</p>
    </div>
</body>
</html>

        `);
    });
});


// Serve index.html as the main page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Start the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
