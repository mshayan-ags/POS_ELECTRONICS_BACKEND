const { existsSync } = require("fs");
const { Router } = require("express");

const router = Router();

//downloading files
const GetImage = router.get(`/GetImage/:filename`, (req, res) => {
	const { filename } = req.params;
	let file;
	file = `./uploads/${filename}`;

	if (existsSync(file)) return res.download(file);

	res.status(404).send("file not found...");
});

module.exports = { GetImage };
