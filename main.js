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

    const dateParts = newData.data.split("/");
    const timestamp = new firebase.firestore.Timestamp(
        Date.parse(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`) / 1000,
        0
    );

    newData.data = timestamp;
    await gastos.add(newData);

    res.send(JSON.stringify("Gasto armazenado com sucesso!"));
});

app.get("/gastos", async (req, res) => {
    const snapshot = await gastos.orderBy("data", "desc").get();
    listaGastos = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    listaGastos.forEach((gasto) => {
        if (gasto.data instanceof firebase.firestore.Timestamp) {
            gasto.data = gasto.data.toDate().toLocaleDateString("pt-BR");
        }
    });

    res.send(listaGastos);
});

app.delete("/gastos", async (req, res) => {
    id = req.body.id;

    try {
        await gastos.doc(id).delete();
        res.send(JSON.stringify("Gasto removido com sucesso!"));
    } catch (error) {
        res.status(500).send(JSON.stringify("Erro ao remover o gasto."));
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server rodando na porta ${PORT}`);
});

//ping para evitar inatividade
const intervaloPing = 14 * 60 * 1000; // 14min em ms

setInterval(() => {
    require("http")
        .get(`https://api-montresor.onrender.com`, (res) => {
            console.log("Ping enviado com sucesso");
        })
        .on("error", (err) => {
            console.error("Erro ao enviar ping:", err);
        });
}, intervaloPing);
