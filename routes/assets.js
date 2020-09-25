const router = require('express').Router();

router.get("/login", async (req, res) => {
  try {
    const filepath = [
      "./assets/login/frutas.jpg",
      "./assets/login/limones.jpg",
      "./assets/login/manzanas.jpg"]
      
    return res.download(filepath[Math.floor(Math.random() * filepath.length)])

  } catch (err) {
    console.error(err.message);
    return res.status(500).json("Server error");
  }
})

module.exports = router;