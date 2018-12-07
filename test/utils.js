const login = async (page, optional = {}) => {
  const username = optional.username || 'admin';
  const password = optional.password || 'admin';
  const usernameBox = await page.waitForSelector('input[name=username]', {
    timeout: 1000
  });
  const passwordBox = await page.$('input[name=password]');
  await usernameBox.click({ clickCount: 3 }); // select all
  await usernameBox.type(username);
  await passwordBox.click({ clickCount: 3 }); // select all
  await passwordBox.type(password);
  await page.click('button[type=Submit]');
};

module.exports = {
  login
};
