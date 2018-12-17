const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  // const iframe = await browser.newPage();
  await page.goto("https://twitter.com/brother_chui");

  // const html = await page.evaluate(
  //   () => document.querySelector(".ProfileHeaderCard-name a").textContent
  // );

  // iframe.goto(document.querySelectorAll("iframe")[0].src);
  // const html = await page.evaluate(() =>
  //   iframe.evaluate(() => {
  //     return document.querySelector(
  //       "img.ProfileAvatar-image"
  //     ).alt;
  //   })
  // );
  async function getUser() {
    return await page.evaluate(() => {
      let user = {
        userInfo: {
          name: null,
          at: null,
          avatar: null
        },
        twits: null
      };
      user.userInfo.name = document.querySelector(
        "img.ProfileAvatar-image"
      ).alt;

      user.userInfo.at = document.querySelector(
        "b.u-linkComplex-target"
      ).innerText;

      user.userInfo.avatar = document.querySelector(
        "img.ProfileAvatar-image"
      ).src;

      user.twits = Array.from(document.querySelectorAll("div.content"))
        .filter(twit => {
          return twit.querySelector("p");
        })
        .map(twit => {
          return {
            text: twit.querySelector("p").innerText.trim(),
            pics: Array.from(
              twit.querySelectorAll("img:not(.avatar):not(.Emoji)")
            ).reduce((p, i) => {
              return p.concat(i.src);
            }, [])
          };
        });
      return user;
    });
  }
  const user = await getUser();
  console.log(user);
  await browser.close();
})();
