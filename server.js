const app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(http);
const endpoint = "https://api.iextrading.com/1.0";
var fetch = require("node-fetch");
const Observable = require("rxjs/Observable");

var observable = Observable.Observable.create(observer => {
  setInterval(() => {
    fetch(`https://api.iextrading.com/1.0/tops?symbols=SNAP,fb,AIG%2b`)
      .then(response => response.text())
      .then(response => {
        observer.next("this is observer");
        observer.next(response);
        io.emit("quoteResponse", response);
      });
  }, 3000);
});

observable.subscribe(x => console.log(x), x => console.log(x));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/public/index.html");
});

io.on("connection", socket => {
  console.log("someone connected on the socket yo");
  //   socket.on("clientRequestStock", quote => {
  //     fetch(`https://api.iextrading.com/1.0/${quote}`)
  //       .then(response => response.text())
  //       .then(response => {
  //         console.log(response);
  //         io.emit("quoteResponse", response);
  //       });
  //   });
});

http.listen(3000);
