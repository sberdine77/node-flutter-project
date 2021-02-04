const express = require("express");
const bodyParser = require("body-parser");


const app = express();
//app.use(bodyParser.json)

app.get('/', (req, res) => {
	return res.send("Hello World!");
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Our app is running on port ${ PORT }`);
});