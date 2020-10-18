const {chromium} = require('playwright');

const url = 'https://gurushots.com';

const getTeamChallenges = async (user, pwd) => {
	const browser = await chromium.launch();
	const context = await browser.newContext();
	const page = await context.newPage({
		userAgent:
			'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36',
		headless: false,
	});

	await page.goto(`${url}`);

	await page.click('.signin');

	await page.type('[name=email]', user);
	await page.type('[type=password]', pwd);

	await page.click('.modal-login__submit');

	await page.waitForNavigation();
	await page.waitForTimeout(200);

	await page.click('.gs-header__main-menu__teams');

	await page.waitForNavigation();
	await page.waitForTimeout(2000);

	const challenges = (await page.$$('.match-join__bottom .match-challenge')).length;
	const data = [];

	for (let i = 0; i < challenges; i++) {
		const el = `.match-join__bottom .match-challenge:nth-child(${i + 1})`;

		const getTime = await page.textContent(`${el} .gs-challenge__match-timer .gs-challenge__countdown`);
		const hours = parseInt(getTime.trim().split(' ')[0].slice(0, -1));
		const minutes = parseInt(getTime.trim().split(' ')[1].slice(0, -1));
		const currentDate = new Date();
		const date = new Date(currentDate);
		date.setHours(currentDate.getHours() + hours);
		date.setMinutes(currentDate.getMinutes() + minutes);

		const name = await page.textContent(`${el} .gs-challenge__match-title`);
		const link = await page.getAttribute(`${el} .gs-challenge__data__link`, 'href');

		data.push({
			name,
			link: `${url}${link}`,
			end: date.toLocaleString(),
		});
	}

	browser.close();

	return data;
};

module.exports = getTeamChallenges;
