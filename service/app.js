var express = require("express"),
	http = require("http"),
	path = require("path"),
	routes = require("./src/routes");


var app = express();

app.set("port", process.env.PORT || 9003);
app.set("views", __dirname + "/src/views");
app.set("view engine", "ejs");

app.use(express.logger("dev"));
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(app.router);
app.use(express.static(path.join(__dirname, "public")));

app.get("/", routes.index);
app.get("/view/:collection/:id", routes.index);
app.all("/api/:collection", routes.api);
app.all("/api/:collection/:id", routes.api);


http.createServer(app).listen(app.get("port"), function(){
	console.log("server listening on port " + app.get("port"));
});
