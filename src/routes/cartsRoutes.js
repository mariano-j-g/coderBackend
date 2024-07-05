import { Router } from "express";
import fs from "fs";
import __dirname from "../utils.js";
const router = Router();
const URL = __dirname + "/data/carrito.json";

router.get("/", async (req, res) => {
  const cartsInDatabase = JSON.parse(await fs.promises.readFile(URL, "utf-8"));
  const limit = req.query.limit;

  const limitData = cartsInDatabase.slice(0, limit);

  if (limitData.length) {
    return res.send(limitData);
  } else return res.status(202).send("No se encontraron carros en tu busqueda");
});
router.post("/", async (req, res) => {
  const cartsInDatabase = JSON.parse(await fs.promises.readFile(URL, "utf-8"));

  const newId = () => {
    if (cartsInDatabase.length) {
      const lastCartInDatabase = cartsInDatabase[cartsInDatabase.length - 1];
      const lastId = lastCartInDatabase.id;
      return lastId + 1;
    } else {
      return 1;
    }
  };

  const newCartWithId = { products: [], id: newId() };
  cartsInDatabase.push(newCartWithId);

  const updatedDatabase = JSON.stringify(cartsInDatabase, null, " ");
  await fs.promises.writeFile(URL, updatedDatabase);

  return res.send("New cart add");
});
router.get("/:id", async (req, res) => {
  const cartsInDatabase = JSON.parse(await fs.promises.readFile(URL, "utf-8"));
  const cartFinded = cartsInDatabase.find((item) => item.id == req.params.id);

  if (cartFinded) {
    if (cartFinded.products.length) {
      return res.send(cartFinded.products);
    }
    return res.send("Carro vacio");
  } else {
    return res
      .status(404)
      .send("El carro id:" + req.params.id + "inexistente en base de datos");
  }
});
router.post("/:idcart/:idproduct", async (req, res) => {
  const cartsInDatabase = JSON.parse(await fs.promises.readFile(URL, "utf-8"));

  const cartFinded = cartsInDatabase.find(
    (item) => item.id == req.params.idcart
  );

  if (cartFinded) {
    const productExistInCart = cartFinded.products.find(
      (item) => item.product == req.params.idproduct
    );
    if (productExistInCart) {
      productExistInCart.quantity++;
      const updatedDatabase = JSON.stringify(cartsInDatabase, null, " ");
      await fs.promises.writeFile(URL, updatedDatabase);

      return res.send(
        "Nuevo producto con id:" +
          req.params.idproduct +
          " en carro con id:" +
          req.params.idcart
      );
    } else {
      const productInCart = {
        product: parseInt(req.params.idproduct),
        quantity: 1,
      };
      cartFinded.products.push(productInCart);

      const updatedDatabase = JSON.stringify(cartsInDatabase, null, " ");
      await fs.promises.writeFile(URL, updatedDatabase);

      return res.send(
        "Se agrego el producto con id:" +
          req.params.idproduct +
          " al carro con id:" +
          req.params.idcart
      );
    }
  } else {
    return res.status(404).send("Carro inexistente");
  }
});

export default router;
