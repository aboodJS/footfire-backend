import express, { json, urlencoded } from "express";
import cors from "cors";
import "dotenv/config";

const app = express();

const port = process.env.PORT;
const apiUrl = process.env.API_URL;

app.use(express.static("static"));
app.use(cors());
app.use(json());

const rootRoute = app.route("/");
const teamRoute = app.route("/teams/:team");
const leagueRoute = app.route("/leagues");

leagueRoute.get(async (req, res) => {
  const data = await fetch(
    `https://www.thesportsdb.com/api/v1/json/123/all_leagues.php?s=soccer`
  )
    .then((d) => d.json())
    .then((d) => d);

  const results = data.leagues.map((element) => {
    return `${element.strLeague}\n`;
  });

  res.send(`results: ${results}`);
});

rootRoute.get((_, res) => {
  res.render("index.html");
});

teamRoute.get(async (req, res) => {
  console.log(req.params.team);
  try {
    const data = await fetch(`${apiUrl}searchteams.php?t=${req.params.team}`)
      .then((d) => d.json())
      .then((d) => d);

    const results = data.teams.map((element) => {
      if (element.strSport === "Soccer") {
        return `${element.strTeam}, ${element.strTeamShort}, ${element.strLeague}`;
      }
    });

    res.send({ results: results });
  } catch (error) {
    res.send({ results: [] });
  }
});

app.post("/login", async (req, res) => {
  console.log(req.body);
  res.send({ request: req.body });
});

app.post("/signup", async (req, res) => {
  console.log({ location: "http://localhost:5173" });
});

app.listen(port, () => {
  console.log(`server url: http://localhost:${port}`);
});
