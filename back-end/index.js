import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fs from 'fs';
import path from 'path'
import https from 'https';

import titleRoutes from "./routes/title.js";
import SearchRoutes from "./routes/searchTitle.js";
import byGenreRoutes from "./routes/byGenre.js";
import NameRoutes from "./routes/name.js";
import SearchNameRoutes from "./routes/searchName.js";
import AdminRoutes from "./routes/admin.js";
import ResetRoute from "./routes/resetall.js";
import HealthRoute from "./routes/healthcheck.js";
import UserRoutes from "./routes/user.js";
import UserLikeRoutes from "./routes/user_likes.js";
import LoginRoute from "./routes/login.js";



const app = express();

app.use(cors());

const HTTPS_PORT = 9876;


const currentFileUrl = import.meta.url;
const currentDir = path.dirname(new URL(currentFileUrl).pathname);
const keyPath = path.join(currentDir, './https_options/key.pem');
const certPath = path.join(currentDir, './https_options/cert.pem');
const privateKey = fs.readFileSync(keyPath, 'utf8');
const certificate = fs.readFileSync(certPath, 'utf8');

const credentials = { key: privateKey, cert: certificate};

app.use((req, res, next) => {
    if (req.secure) {
        next();
    } else {
        res.redirect(`https://${req.headers.host}${req.url}`);
    }
});

app.use(bodyParser.json());


https.createServer(credentials, app).listen(HTTPS_PORT, () => {
    console.log(`Server running on port: ${HTTPS_PORT}`);
});

app.use("/ntuaflix_app/title", titleRoutes);
app.use("/ntuaflix_app/searchTitle", SearchRoutes);
app.use("/ntuaflix_app/byGenre", byGenreRoutes);
app.use("/ntuaflix_app/name", NameRoutes);
app.use("/ntuaflix_app/searchName", SearchNameRoutes);
app.use("/ntuaflix_app/admin/upload", AdminRoutes);
app.use("/ntuaflix_app/admin", ResetRoute);
app.use("/ntuaflix_app/admin", HealthRoute);
app.use("/ntuaflix_app/admin/userConf", UserRoutes);
app.use("/ntuaflix_app/userLikes", UserLikeRoutes);
app.use("/ntuaflix_app/login", LoginRoute);

app.use((req, res) => {
    res.status(404).send('Not Found');
});
