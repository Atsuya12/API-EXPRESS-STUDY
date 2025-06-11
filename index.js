require("dotenv").config(); // puxa os dados do .env
const express = require("express");
const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());

// Conecta ao MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true, // essa linha e a debaixo evitam aviso de depreciação
  useUnifiedTopology: true,
});

const ratingSchema = new mongoose.Schema( //define a estrutura dos documentos do banco
  {
    rating: String,
  },
  {
    collection: "Rating",
  }
);

const Rating = mongoose.model("Rating", ratingSchema); // usado para manipular os dados da coleção


app.get("/ratings", async (req, res) => { //rota get
  try {
    const { rating } = req.query;

    if (rating) {
      const item = await Rating.findOne({ rating });
      if (!item) return res.status(404).json({ mensagem: "Não encontrado" });
      return res.json(item);
    } else {
      const lista = await Rating.find({});
      return res.json(lista);
    }
  } catch (err) {
    console.error("Erro na rota /ratings:", err);
    return res.status(500).json({ erro: "Erro ao buscar rating(s)" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});


// o processo do get é procurar os ratings na coleção. caso seja especificado algum na rota, ele procura, se achar, printa
// caso não ache, mostra a mensagem de erro
// caso não especifique nada, printa tudo que tá na coleção