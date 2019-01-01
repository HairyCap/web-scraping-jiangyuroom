const puppeteer = require("puppeteer");
const url = "http://www.jiangroom.com/queryRooms.html";
const fs = require("fs");
const writeStream = fs.createWriteStream("rooms.csv");

writeStream.write(`roomName,add,floor,area,dire,price,traffic,teg,id \n`);
let pageNumNode = 1;
(async () => {
  const browser = await puppeteer.launch({
    //ture for headless mode
    headless: false,
    args: ["--window-size=1920,1080"]
  });

  const page = await browser.newPage();
  page.setViewport({ height: 1080, width: 1920 });
  await page.goto(url);

  await page.waitFor(() => document.querySelector(".item.clearfix"));

  // console.log(rooms);
  const rooms = async () => {
    await page.waitFor(() => document.querySelectorAll("div.item.clearfix h5"));
    const items = await page.evaluate(() => {
      //return selected elements innerText
      function getinnerText(dom, selector) {
        let innerText = [];
        Array.from(dom.querySelectorAll(selector)).forEach(i => {
          i.innerText && innerText.push(i.innerText.replace(/,/g, "|"));
        });
        return innerText.join("|");
      }

      return Array.from(document.querySelectorAll("div.item.clearfix")).map(
        room => {
          return {
            roomName: getinnerText(room, "h5"),
            add: getinnerText(room, ".add"),
            floor: getinnerText(room, ".floor span"),
            area: getinnerText(room, ".area span"),
            dire: getinnerText(room, ".dire span"),
            price: getinnerText(room, ".price"),
            traffic: getinnerText(room, ".traffic span"),
            teg: getinnerText(room, ".tags.clearfix a"),
            //TODO: need improve by using Regex
            id: room.onclick
              .toString()
              .split("\n")[1]
              .replace("openDetail(", "")
              .replace(")", "")
          };
        }
      );
    });
    //write to csv file
    await items.forEach(item => {
      writeStream.write(
        `${item.roomName},${item.add},${item.floor},${item.area},${item.dire},${
          item.price
        },${item.traffic},${item.teg},${item.id} \n`
      );
    });
    //check next page
    const next = await page.evaluate(() => {
      return !!document.querySelectorAll("a.laypage_next").length;
    });
    //get crrent page number
    const pageNum = await page.evaluate(() => {
      return document.querySelector(".laypage_curr").innerText;
    });
    console.log(pageNum);
    // console.log(items);
    // return items;
    if (next) {
      await page.evaluate(() => {
        document.querySelector("a.laypage_next").click();
      });
      await page.waitFor(() =>
        document.querySelectorAll("div.item.clearfix h5")
      );
      return items.concat(await rooms());
    } else {
      return items;
    }
  };

  await rooms();
  page.waitFor(5000);
  await browser.close();
})();
