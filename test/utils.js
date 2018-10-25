const login = async page => {
  const usernameBox = await page.waitForSelector('input[name=username]', {
    timeout: 1000
  });
  const passwordBox = await page.$('input[name=password]');
  await usernameBox.click();
  await usernameBox.type('admin');
  await passwordBox.click();
  await passwordBox.type('admin');
  await page.click('button[type=Submit]');
};

module.exports = {
  login
};
