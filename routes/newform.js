const router = require('express').Router();

router.post("/", async (req, res) => {
  try {

    const { fruit, variety, lab, cliente, origen, destino, comentarios,
        calibre, lote, lugar_ensayo, mediciones, unidad_experimental,
        tratamientos, replicas, unidades_por_ue } = req.body;

        console.log(req.body)

        
  } catch (err) {
    console.error(err.message);
    return res.status(500).json("Server error");
  }
})

module.exports = router;