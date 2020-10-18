const express = require('express');
const morgan = require('morgan');
const compression = require('compression');
const getEndomondoData = require('./utils/challenges');

const port = process.env.PORT || 3000;
const app = express();

app.use(compression());
app.use(morgan('short'));
app.disable('x-powered-by');
app.disable('etag');
app.use('/assets', express.static('assets'));

app.get('/team-challenges', (req, res, next) => {
	const {challenge, user, pwd} = req.query;
	try {
		getEndomondoData(user, pwd)
			.then((data) => {
				res.set({
					'Content-Type': 'application/json',
				});
				res.send(data);
			})
			.catch((error) => {
				throw new Error(error.message);
			});
	} catch (err) {
		console.error(err);
		res.status(500).send(err.message);
	}
});

app.listen(port, () => console.log(`App listening at http://localhost:${port}`));
