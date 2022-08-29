const jwt = require("jsonwebtoken");
const APP_SECRET = "POS";
const { existsSync, mkdirSync, unlinkSync, createWriteStream } = require("fs");
const path = require("path");

function getTokenPayload(token) {
	return jwt.verify(token, APP_SECRET);
}

function getUserId(req, authToken) {
	if (req) {
		const authHeader = req.headers.authorization;
		if (authHeader) {
			const token = authHeader.replace("Bearer ", "");
			if (!token) {
				throw new Error("No token found");
			}
			const { userId, Role, adminId, username } = getTokenPayload(token);
			return { userId, Role, adminId, username };
		}
	} else if (authToken) {
		const { userId, Role, adminId, username } = getTokenPayload(authToken);
		return { userId, Role, adminId, username };
	}

	throw new Error("Not authenticated");
}

async function saveImage(image, old) {
	return await new Promise((resolve, reject) => {
		try {
			image
				.then(({ createReadStream, ...rest }) => {
					const filename = `${Math.random().toString(32).substr(7, 5)}-${rest.filename}`;
					// checking whether the uploads folder is exists
					if (!existsSync("./uploads")) mkdirSync("./uploads");

					// deleting if old file is given
					if (old && existsSync(`./uploads/${old}`)) unlinkSync(`./uploads/${old}`);
					rest.filename = filename;

					// createReadStream()
					// 	.pipe(createWriteStream(path.join("./uploads", filename)))
					// 	.on("error", (error) => reject(new Error(error.message)))
					// 	.on("finish", () => resolve(rest));
				})
				.catch((error) => console.error(error));
		} catch (error) {
			console.error("catch error", error);
		}
	});
}

async function saveProfilePicture(image, old) {
	return await new Promise((resolve, reject) => {
		try {
			image
				.then(({ createReadStream, ...rest }) => {
					const filename = `${Math.random().toString(32).substr(7, 5)}-${rest.filename}`;
					// checking whether the uploads folder is exists
					if (!existsSync("./uploads")) mkdirSync("./uploads");

					// deleting if old file is given
					if (old && existsSync(`./uploads/${old}`)) unlinkSync(`./uploads/${old}`);
					rest.filename = filename;
					// createReadStream()
					// 	.pipe(createWriteStream(path.join("./uploads", filename)))
					// 	.on("error", (error) => reject(new Error(error.message)))
					// 	.on("finish", () => resolve(rest));
				})
				.catch((error) => console.error(error));
		} catch (error) {
			console.error("catch error", error);
		}
	});
}

module.exports = {
	APP_SECRET,
	getUserId,
	saveImage,
	saveProfilePicture
};
