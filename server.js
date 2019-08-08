const app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(http);
const endpoint = "https://api.iextrading.com/1.0";
var fetch = require("node-fetch");
const Observable = require("rxjs/Observable");

var observable = Observable.Observable.create(observer => {
  try {
    setInterval(() => {
      fetch(`${endpoint}/tops?symbols=fb`)
        .then(response => response.json())
        .then(response => {
          observer.next(response);
          io.emit("quoteResponse", response[0]);
        });
    }, 5000);
  } catch (err) {
    observer.error(err);
  }
});

observable.subscribe(x => console.log(x), error => console.log("ERROR!!!"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/public/index.html");
});

http.listen(3000);
