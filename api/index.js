const axios = require('axios');

module.exports = (req, res) => {
  const { carParkNo } = req.query;
  const base_url = "https://api.data.gov.sg/v1/transport/carpark-availability";
  
  var tenMinInterval = [];
  
  const currentTime = new Date() / 1000;
  
  for (var interval = 0; interval < 6; interval++) {
    tenMinInterval.push(currentTime - (600*interval));
  }
  
  res.status(200).send(tenMinInterval)
}
