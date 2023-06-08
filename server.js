const express = require('express');
const app = express();
const { pool } = require("./dbConfig");
const bcrypt = require("bcrypt");

const PORT = process.env.PORT || 4000;

app.set("view engine", "ejs"); // Decirle a .ejs que utilice view engine
app.use(express.urlencoded({ extended: false})); // para enviar datos del front al back

app.use('/modules', express.static('node_modules'));

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
});

app.get("/", (req, res) => { // Esta es la página principar: localHost:4000/
   // res.send('Hola 😊'); 
    res.render("index");
});

app.get("/users/register", (req,res) => { //localHost:4000/users/register
    res.render("register");
});

app.get("/users/login", (req,res) => {
    res.render("login");
});

app.get("/users/dashboard", (req,res) => {
    res.render("dashboard", {user: "Alvaro"} );
});

app.get("/users/logout", (req,res) => {
    res.render("login");
});
app.get("/api/jugadores", (req, res) => {
    pool.query('SELECT * FROM jugadores', (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error al obtener los datos' });
        } else {
            res.json(result.rows);
        }
    });
});

app.post("/users/register", async (req,res) => { // Cuando recibimos un POST de esta URL tomamos los datos de esas variables con ese nombre/id
    let { name, email, password, password2 } = req.body;

    console.log({ name, email, password, password2 });

    let errors = []; // Para capturar los errores, por si queremos tratarlos
  //  res.render("register", {errors}); // Le pasaríamos los errores a register.ejs y este los tendría que capturar para luego mostrarlos

    // Si todas las validaciones son correctas
    let hashedPassword = await bcrypt.hash(password, 10);
    console.log(`La contraseña codificada es ${hashedPassword}`);

    // Ahora hacemos la query para ver si el usuario existe

    pool.query(
        `SELECT * FROM public.users WHERE email = $1`, [email], (err, results) => {
            if(err){
                 throw err
            }
                console.log(results.rows);
        }
    )
});


app.post("/users/login", async (req, res) => {
    let { email, password } = req.body;
  
    console.log({ email, password });
  
    // Ahora hacemos la query para ver si el usuario existe
    pool.query(
      `SELECT * FROM public.users WHERE email = $1`,
      [email],
      (err, results) => {
        if (err) {
          throw err;
        }
  
        if (results.rows.length === 0) {
          // No se encontraron datos para el email en la BBDD
          res.status(404).send("No se ha encontrado a nadie con ese email.");
        } else {
          const user = results.rows[0];
          const storedPassword = user.password;
  
          if (password === storedPassword) {
            const userRole = user.role;
            console.log(userRole);
  
            // Redirigir al usuario al dashboard con el rol obtenido
            res.render("dashboard", { user: "Admin", userRole: userRole });
          } else {
            // La contraseña no coincide
            res.status(401).send("Contraseña incorrecta.");
          }
        }
      }
    );
  });
  
  
  



