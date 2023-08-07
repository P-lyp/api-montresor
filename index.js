// FIREBASE

const express = require("express");
const app = express();
const firebase = require("firebase");
const cors = require("cors");

app.use(express.json());
app.use(cors());

const firebaseConfig = {
    apiKey: "AIzaSyDcV-xm16aJw-fC4NEyZZpaGCN1akAzt2Y",
    authDomain: "bd-montresor.firebaseapp.com",
    projectId: "bd-montresor",
    storageBucket: "bd-montresor.appspot.com",
    messagingSenderId: "261687964141",
    appId: "1:261687964141:web:c9a312bb46e1d00eb7f7e4",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const compras = db.collection("compras");

app.get("/", (req, res) => {
    console.log("Requisição GET concluída!");
    res.send("API da Montresor funcionando! - Firebase");
});

app.put("/compras", async (req, res) => {
    const newData = req.body;
    await compras.add(newData);

    res.send("Uusário armazenado com sucesso!");
});

app.get("/compras", async (req, res) => {
    const snapshot = await compras.get();
    listaCompras = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.send(listaCompras);
});

app.listen(process.env.PORT || 3000);
