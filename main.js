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
const pedidos = db.collection("pedidos");

app.get("/", (req, res) => {
    res.send(JSON.stringify("API da Montresor funcionando! - Firebase"));
});

// ROUTES GASTOS

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

app.put("/gastos", async (req, res) => {
    const newData = req.body;

    // conversao do modelo de data padrão para padrão firestore, para que depois possa exibir a data na ordem mais recente
    const dateParts = newData.data.split("/");
    const timestamp = new firebase.firestore.Timestamp(
        Date.parse(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`) / 1000,
        0
    );

    newData.data = timestamp;
    await gastos.add(newData);

    res.send(JSON.stringify("Gasto armazenado com sucesso!"));
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

// ROUTES PEDIDOS

app.get("/pedidos", async (req, res) => {
    const snapshot = await pedidos.orderBy("dataInicio", "desc").get();
    listaPedidos = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));

    listaPedidos.forEach((pedido) => {
        if (pedido.dataInicio instanceof firebase.firestore.Timestamp) {
            pedido.dataInicio = pedido.dataInicio
                .toDate()
                .toLocaleDateString("pt-BR");
        }
    });

    res.send(listaPedidos);
});

app.put("/pedidos", async (req, res) => {
    const newData = req.body;

    // conversao do modelo de data padrão para padrão firestore, para que depois possa exibir a data na ordem mais recente
    const dateParts = newData.dataInicio.split("/");
    const timestamp = new firebase.firestore.Timestamp(
        Date.parse(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`) / 1000,
        0
    );

    newData.dataInicio = timestamp;
    await pedidos.add(newData);

    res.send(JSON.stringify("Pedido armazenado com sucesso!"));
});

app.delete("/pedidos", async (req, res) => {
    id = req.body.id;

    try {
        await pedidos.doc(id).delete();
        res.send(JSON.stringify("Pedido removido com sucesso!"));
    } catch (error) {
        res.status(500).send(JSON.stringify("Erro ao remover pedido."));
    }
});

app.update("/pedidos", async (req, res) => {
    id = req.body.id;

    try {
        await pedidos.doc(id).update({
            finalizado: true,
        });
        res.send(JSON.stringify("Pedido finalizado"));
    } catch (error) {
        res.status(500).send(JSON.stringify("Erro ao finalizar pedido!"));
    }
});

// FIM ROUTES

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server rodando na porta ${PORT}`);
});

//ping para evitar inatividade
const intervaloPing = 14 * 60 * 1000; // 14min em ms

setInterval(() => {
    require("https")
        .get(`https://api-montresor.onrender.com`)
        .on("error", (err) => {
            console.error("Erro ao enviar ping:", err);
        });
}, intervaloPing);
