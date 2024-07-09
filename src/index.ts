const puppeteer = require("puppeteer");
import { Browser, launch } from "puppeteer";
const fs = require("fs");
const url = "https://books.toscrape.com";

const main = async () => {
  const browser: Browser = await puppeteer.launch({ headless: launch });
  const page = await browser.newPage(); // create nw page
  await page.goto(url); // after creating go to this url page

  // this is another concept, change the headless: true
  // to do this, comment all the things after this,from bookData function to the end
  // & change the url to this - https://bot.sannysoft.com
  // await page.screenshot({ path: 'bot.jpg' })

  const bookData = await page.evaluate((url) => {
    const convertPrice = (price: string) => {
      return parseFloat(price.replace("£", ""));
    };

    const convertRating = (rating: string) => {
      switch (rating) {
        case "One":
          return 1;
        case "Two":
          return 2;
        case "Three":
          return 3;
        case "Four":
          return 4;
        case "Five":
          return 5;
      }
    };

    const book = Array.from(document.querySelectorAll(".product_pod")); // find all the products which has class name of .product_pod
    const data = book.map(
      (book: any) => ({
        title: book.querySelector("h3 a").getAttribute("title"), // find a tag inside of h3 then find title inside of that
        price: convertPrice(book.querySelector(".price_color").innerText), // find class - price_color
        img: url + book.querySelector("img").getAttribute("src"), // find image tag, then find src inside
        rating: convertRating(book.querySelector(".star-rating").classList[1]),
      }),
      url
    );
    return data;
  }, url);
  console.log(bookData);

  console.log('allright');
  await browser.close(); // close automatically at the end

  // save all the outputs in data.json
  fs.writeFile("data.json", JSON.stringify(bookData), (err: any) => {
    if (err) throw err;
    console.log("succesfully saved json");
  });
};

main();
