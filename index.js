const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const PORT = process.env.PORT || 5000;

// scraping file
const request = require("request-promise");
const cheerio = require("cheerio");
const json2csv = require("json2csv").Parser;
const fs = require("fs");

app.use(express.json());
app.use(cors());
dotenv.config();

const score =
  "https://www.espncricinfo.com/series/icc-cricket-world-cup-2023-24-1367856/afghanistan-vs-england-13th-match-1384404/live-cricket-score";



app.get("/", async (req, res) => {
  res.status(200).send({ message: "Ok" });
});

app.get("/result",async(req,res)=>{
  try {
    (async () => {
      const response = await request({
        uri: score,
        headers: {
          accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
          "accept-encoding": "gzip, deflate, br",
          "accept-language": "en-US,en;q=0.9",
        },
        gzip: true,
      });
      let $ = cheerio.load(response);

      let scores = cheerio.text(
        $(
          'div[class="ds-flex ds-flex-col ds-mt-3 md:ds-mt-0 ds-mt-0 ds-mb-1"] > div'
        )
      );
      res.status(200).send({"result": scores});
    })();
  } catch (error) {
    res.status(402).send({"message":"something went wrong"})
  }
})

app.get("*", async (req, res) => {
  res.status(402).send({ message: "Unauthorize Route" });
});

app.listen(PORT, () => {
  console.log(`This Server Running Port is ${PORT}`);
});
