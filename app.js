require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

spotifyApi
  .clientCredentialsGrant()
  .then((data) => {
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );
// Our routes go here:

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/albums/:artistId", (req, res, next) => {
  let artistId = req.params.artistId;

  spotifyApi.getArtistAlbums(artistId).then((data) => {
    res.render("albums", { response: data.body });
  });
});

app.get("/artist-search", (req, res) => {
  //let {artist} = req.query
  let search = req.query.artist;

  spotifyApi
    .searchArtists(search)
    .then((data) => {
      console.log("The received data from the API: ", data.body.artists.items);
      res.render("artist-search", { response: data.body.artists.items });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});
app.get("/tracks/:albumId", (req, res, next) => {
  let albumId = req.params.albumId;

  spotifyApi
    .getAlbumTracks(albumId)
    .then((data) => {
      res.render("tracks", { tracks: data.body.items });
    })
    .catch((error) => {
      console.error("Error retrieving tracks:", error);
      res.status(500).send("Error retrieving tracks");
    });
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
