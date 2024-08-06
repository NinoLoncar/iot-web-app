const generateApiKey = require("generate-api-key").default;

exports.generateAuthKey = function () {
	return generateApiKey({
		method: "string",
		pool: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
		length: 8,
	});
};
