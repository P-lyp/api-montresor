// FIREBASE

const express = require("express");
const app = express();
const firebase = require("firebase");
const cors = require("cors");

app.use(express.json());
app.use(cors());

const firebaseConfig = {
    apiKey: "AIzaSyDFEvPBJrLaNFbVT5Hz5Z3ReGDhj5h7xtQ",
    authDomain: "bd-montresor-d363c.firebaseapp.com",
    projectId: "bd-montresor-d363c",
    storageBucket: "bd-montresor-d363c.appspot.com",
    messagingSenderId: "879040624305",
    appId: "1:879040624305:web:b66826bebe54f773965490",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const gastos = db.collection("gastos");

app.get("/", (req, res) => {
    console.log("Requisição GET concluída!");
    res.send(JSON.stringify("API da Montresor funcionando! - Firebase"));
});

app.put("/gastos", async (req, res) => {
    const newData = req.body;
    await gastos.add(newData);

    res.send(JSON.stringify("Usário armazenado com sucesso!"));
});

app.get("/gastos", async (req, res) => {
    const snapshot = await gastos.get();
    listaGastos = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.send(listaGastos);
});

app.listen(process.env.PORT || 3000);
