const axios = require('axios');

module.exports = (req, res) => {
  const { carParkNo } = req.query;
  
  const base_url = "https://api.data.gov.sg/v1/transport/carpark-availability";
  
  var tenMinIntervalData = [];
  var hourIntervalData = [];
  
  const currentTime = new Date() / 1000;
  
  for (var interval = 0; interval < 6; interval++) {
    const intervalTime = new Date(currentTime - (600*interval));
    axios.get(`${base_url}?date_time=${intervalTime.getFullYear()}-${(intervalTime.getMonth()+1).toString().padStart(2, '0')}-${intervalTime.getDate().toString().padStart(2, '0')}T${intervalTime.getHours().toString().padStart(2, '0')}:${intervalTime.getMinutes().toString().padStart(2, '0')}:${intervalTime.getSeconds().toString().padStart(2, '0')}`)
    .then(function (response) {
      const carpark_data = response.data.items[0].carpark_data;
      for (var item in carpark_data) {
        if (carpark_data[item].carpark_number == carParkNo) {
          tenMinIntervalData.push(carpark_data[item]);
        }
      }
    })
  }
  
  for (var interval = 0; interval < 24; interval++) {
    const intervalTime = new Date(currentTime - (3600*interval));
    axios.get(`${base_url}?date_time=${intervalTime.getFullYear()}-${(intervalTime.getMonth()+1).toString().padStart(2, '0')}-${intervalTime.getDate().toString().padStart(2, '0')}T${intervalTime.getHours().toString().padStart(2, '0')}:${intervalTime.getMinutes().toString().padStart(2, '0')}:${intervalTime.getSeconds().toString().padStart(2, '0')}`)
    .then(function (response) {
      const carpark_data = response.data.items[0].carpark_data;
      for (var item in carpark_data) {
        if (carpark_data[item].carpark_number == carParkNo) {
          hourIntervalData.push(carpark_data[item]);
        }
      }
    })
  }
  
  res.status(200).send([tenMinIntervalData, hourIntervalData]);
}
