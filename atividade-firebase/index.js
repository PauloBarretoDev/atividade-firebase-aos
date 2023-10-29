const express = require("express");
const app = express();
const jwt = require('jsonwebtoken');

const admin = require("firebase-admin");
const credentials = require("./fb-auth-aos-firebase-adminsdk-v5lia-e24bd63186.json");
admin.initializeApp({
    credential: admin.credential.cert(credentials)
});

const SECRET = './firebase-credentials'; 

app.use(express.json());

app.use(express.urlencoded( {extended: true}));

app.post('/cadastro', async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const userRecord = await admin.auth().createUser({
        email,
        password,
      });
  
      res.status(200).json({
        statusCode: 200,
        message: 'Usuário criado com sucesso!',
        data: {
          uid: userRecord.uid,
        },
      });
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      res.status(500).json({
        statusCode: 500,
        message: 'Erro ao criar usuário.',
      });
    }
  });

// Rota de Login para obter um token JWT
app.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Autenticando usuário no Firebase
      const user = await admin.auth().getUserByEmail(email);
      // Gerar um token JWT com o UID do usuário
      const token = jwt.sign({ uid: user.uid }, SECRET, {
        expiresIn: '2h', // O Token deve expirar em 2 horas
      });
  
      res.status(200).json({
        statusCode: 200,
        message: 'Login realizado com sucesso!',
        data: {
          token,
        },
      });
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      res.status(401).json({
        statusCode: 401,
        message: 'Não autorizado! Usuário não encontrado ou senha incorreta.',
      });
    }
  });
  


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}.`);
});