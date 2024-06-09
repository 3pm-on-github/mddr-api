const http = require('http');

// Define the hostname and port
const hostname = '0.0.0.0';
const port = 3000;

let ipAddressesThatLikedOrDisliked = {};
let likes = 0;
let dislikes = 0;

// Function to get the client IP address
const getClientIp = (req) => {
  const forwarded = req.headers['x-forwarded-for'];
  return forwarded ? forwarded.split(',').pop() : req.connection.remoteAddress;
};

// Create the server
const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');

  if (req.url === "/dislikesnlikes") {
    res.statusCode = 200;
    res.end(JSON.stringify({ likes, dislikes }));
  } else if (req.url === "/like") {
    const clientIp = getClientIp(req);
    if (!ipAddressesThatLikedOrDisliked[clientIp]) {
      likes++;
      ipAddressesThatLikedOrDisliked[clientIp] = true;
      res.statusCode = 200;
      res.end(JSON.stringify({ success: true, likes, dislikes }));
    } else {
      res.statusCode = 429;
      res.end(JSON.stringify({ error: "You have already disliked/liked this", success: false }));
    }
  } else if (req.url === "/dislike") {
    const clientIp = getClientIp(req);
    if (!ipAddressesThatLikedOrDisliked[clientIp]) {
      dislikes++;
      ipAddressesThatLikedOrDisliked[clientIp] = true;
      res.statusCode = 200;
      res.end(JSON.stringify({ success: true, likes, dislikes }));
    } else {
      res.statusCode = 429;
      res.end(JSON.stringify({ error: "You have already disliked/liked this", success: false }));
    }
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: "Not Found", success: false }));
  }
});

// Start the server
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
