import express from "express";
import productsRoutes from "./routes/productsRoutes.js";
import cartsRoutes from "./routes/cartsRoutes.js";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/products", productsRoutes);
app.use("/api/carts", cartsRoutes);

app.listen(PORT, console.log("Servidor corriendo en:http://localhost:" + PORT));
