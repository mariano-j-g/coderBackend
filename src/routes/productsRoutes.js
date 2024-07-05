import { Router } from "express";
import fs from "fs";
import __dirname from "../utils.js";
const URL = __dirname + "/data/productos.json";

const router = Router();

router.get("/", async (req, res) => {
  const productsInDataBase = JSON.parse(
    await fs.promises.readFile(URL, "utf-8")
  );
  const limit = req.query.limit;

  const productsToShow = productsInDataBase.slice(0, limit);

  if (productsToShow.length) {
    return res.send(productsToShow);
  } else return res.status(200).send("No se encontro producto");
});
router.get("/:id", async (req, res) => {
  const productsInDataBase = JSON.parse(
    await fs.promises.readFile(URL, "utf-8")
  );
  const productFinded = productsInDataBase.find(
    (item) => item.id == req.params.id
  );

  if (productFinded) {
    return res.send(productFinded);
  } else {
    return res
      .status(404)
      .send(
        "Producto con id:" +
          req.params.id +
          " no se encuentra en la base de datos"
      );
  }
});
router.post("/", async (req, res) => {
  const productsInDataBase = JSON.parse(
    await fs.promises.readFile(URL, "utf-8")
  );
  const title = req.body.title;
  const description = req.body.description;
  const code = req.body.code;
  const price = req.body.price;
  const stock = req.body.stock;
  const category = req.body.category;

  if (title && description && code && price && stock && category) {
    if (typeof title !== "string") {
      return res.send("El campo title debe ser un texto (string)");
    }
    if (typeof description !== "string") {
      return res.send("El campo description debe ser un texto (string)");
    }
    if (typeof code !== "string") {
      return res.send("El campo code debe ser un texto (string)");
    }
    if (typeof price !== "number") {
      return res.send("El campo price debe ser un número (Number)");
    }
    if (typeof stock !== "number") {
      return res.send("El campo stock debe ser un número (Number)");
    }
    if (typeof category !== "string") {
      return res.send("El campo category debe ser un texto (string)");
    }
    if (req.body.thumbnails) {
      if (!Array.isArray(req.body.thumbnails)) {
        return res.send(
          "El campo thumbnails debe ser un arreglo de strings (array)"
        );
      }
    }

    const newId = () => {
      if (productsInDataBase.length) {
        const lastProduct = productsInDataBase[productsInDataBase.length - 1];
        const lastId = lastProduct.id;
        return lastId + 1;
      } else {
        return 1;
      }
    };

    const newProductWithId = { ...req.body, status: true, id: newId() };
    productsInDataBase.push(newProductWithId);

    const updatedDatabase = JSON.stringify(productsInDataBase, null, " ");

    await fs.promises.writeFile(URL, updatedDatabase);

    return res.send("Se agreg producto.");
  } else {
    return res.send("Complete todos los campos");
  }
});
router.put("/:id", async (req, res) => {
  const productsInDataBase = JSON.parse(
    await fs.promises.readFile(URL, "utf-8")
  );

  const result = productsInDataBase.find((item) => item.id == req.params.id);

  if (result) {
    const title = req.body.title;
    const description = req.body.description;
    const code = req.body.code;
    const price = req.body.price;
    const stock = req.body.stock;
    const category = req.body.category;

    if (title && description && code && price && stock && category) {
      if (typeof title !== "string") {
        return res.send("El campo title debe ser un texto (string)");
      }
      if (typeof description !== "string") {
        return res.send("El campo description debe ser un texto (string)");
      }
      if (typeof code !== "string") {
        return res.send("El campo code debe ser un texto (string)");
      }
      if (typeof price !== "number") {
        return res.send("El campo price debe ser un número (Number)");
      }
      if (typeof stock !== "number") {
        return res.send("El campo stock debe ser un número (Number)");
      }
      if (typeof category !== "string") {
        return res.send("El campo category debe ser un texto (string)");
      }
      if (req.body.thumbnails) {
        if (!Array.isArray(req.body.thumbnails)) {
          return res.send(
            "El campo thumbnails debe ser un arreglo de strings (array)"
          );
        }
      }

      result.title = req.body.title;
      result.description = req.body.description;
      result.code = req.body.code;
      result.price = req.body.price;
      if (req.body.status === false) {
        result.status = false;
      }
      result.stock = req.body.stock;
      result.category = req.body.category;
      if (req.body.thumbnails) {
        result.thumbnails = req.body.thumbnails;
      }

      const updatedDatabase = JSON.stringify(productsInDataBase, null, " ");

      await fs.promises.writeFile(URL, updatedDatabase);

      return res.send(
        "Modifico el producto con id: " + req.params.id + " correctamente"
      );
    }
  } else {
    return res
      .status(404)
      .send("El producto con el id:" + req.params.id + "No existe");
  }
});
//Borrado permanente del producto
router.delete("/:id", async (req, res) => {
  const productsInDataBase = JSON.parse(
    await fs.promises.readFile(URL, "utf-8")
  );
  //Verifica que exista el producto con ese id

  const indexProductoToDelete = productsInDataBase.findIndex(
    (item) => item.id == req.params.id
  );

  if (indexProductoToDelete > -1) {
    productsInDataBase.splice(indexProductoToDelete, 1);

    const updatedDatabase = JSON.stringify(productsInDataBase, null, " ");

    //fs.writeFileSync(URL, updatedDatabase);//Metodo sincrónico
    await fs.promises.writeFile(URL, updatedDatabase);

    return res.send("Se elimino producto");
  } else {
    return res
      .status(404)
      .send(
        "El producto con el id:" +
          req.params.id +
          " no se encuentra en la base de datos"
      );
  }
});

export default router;
