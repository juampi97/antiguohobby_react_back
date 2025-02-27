import express from "express";
import dotenv from "dotenv";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

dotenv.config();

const port = process.env.PORT || 8080;

const app_id = process.env.APP_ID;
const client_secret = process.env.CLIENT_SECRET;
const refresh_token = process.env.REFRESH_TOKEN;

const api_ml_path = "https://api.mercadolibre.com";
const api_path = process.env.API_PATH || `localhost:${port}`;

// TO DO Pedir primero y mandarlo
let ACCES_TOKEN = "";
let USER_ID = "30536750";

app.listen(port, () => {
  console.log(`Corriendo app en puerto ${port}`);
});

// Pedido Token authorization
app.get("/oauth/token", (req, res) => {
  const myHeaders = new Headers();
  myHeaders.append("accept", "application/json");
  myHeaders.append("content-type", "application/x-www-form-urlencoded");

  const urlencoded = new URLSearchParams();
  urlencoded.append("grant_type", "refresh_token");
  urlencoded.append("client_id", `${app_id}`);
  urlencoded.append("client_secret", `${client_secret}`);
  urlencoded.append("refresh_token", `${refresh_token}`);

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: urlencoded,
    redirect: "follow",
  };

  fetch(`${api_ml_path}/oauth/token`, requestOptions)
    .then((response) => response.text())
    .then((result) => {
      return res.status(200).send(result);
    })
    .catch((error) => {
      return res.status(400).send(error);
    });
});

// Busqueda de archivos
app.get("/sites/:siteid/user/:userid/offset/:offset", (req, res) => {
  let siteid = req.params.siteid;
  let userid = req.params.userid;
  let offset = req.params.offset;
  ACCES_TOKEN = req.headers.Authorization;

  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${ACCES_TOKEN}`);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  fetch(
    `${api_ml_path}/sites/${siteid}/search?seller_id=${userid}&offset=${offset}`,
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => {
      return res.status(200).send(result);
    })
    .catch((error) => {
      return res.status(400).send(error);
    });
});

// https://api.mercadolibre.com/sites/MLA/search?seller_id=30536750&category=MLA372999
// Opcion 1 para filtrar categorias con un for each de los presionados

app.get("/categories/:cat", (req, res) => {
  let categorie = req.params.cat;
  ACCES_TOKEN = req.headers.Authorization;

  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${ACCES_TOKEN}`);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  fetch(`https://api.mercadolibre.com/categories/${categorie}`, requestOptions)
    .then((response) => response.text())
    .then((result) => {
      return res.status(200).send(result);
    })
    .catch((error) => {
      return res.status(400).send(error);
    });
});
