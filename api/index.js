var moment = require('moment-timezone');
var axios = require('axios');

module.exports = (req, res) => {
  const carparkno = req.query.carparkno;
  const type = req.query.type;
  const base_url = "https://api.data.gov.sg/v1/transport/carpark-availability";
  
  var tenMinIntervalData = [];
  var hourIntervalData = [];
  
  const currentEpoch = Date.now();

  if (!carparkno || carparkno == "") {
    res.send({"status":"invalid_carparkno"});
  } else {
    if (type == "last_hour") {
      for (var interval = 0; interval < 6; interval++) {
        const intervalTime = parseInt((currentEpoch - (600000*interval)).toFixed());
        const intervalDateTime = moment(new Date(intervalTime).toISOString()).tz("Asia/Singapore").format().substring(0,19);
        var response = await axios.get(`${base_url}?date_time=${intervalDateTime}`);
        console.log(response.data);
        const carpark_data = response.data.items[0].carpark_data;
        for (var item in carpark_data) {
          if (carpark_data[item].carpark_number == carparkno) {
            tenMinIntervalData.push({"timestamp":intervalDateTime,"item":carpark_data[item]});
          }
        }
      }
      res.send({"status":"ok","data":tenMinIntervalData});
    } else if (type == "last_24hours") {
      for (var interval = 0; interval < 24; interval++) {
        const intervalTime = parseInt((currentEpoch - (3600000*interval)).toFixed());
        const intervalDateTime = moment(new Date(intervalTime).toISOString()).tz("Asia/Singapore").format().substring(0,19);
        var response = await axios.get(`${base_url}?date_time=${intervalDateTime}`);
        console.log(response.data);
        const carpark_data = response.data.items[0].carpark_data;
        for (var item in carpark_data) {
          if (carpark_data[item].carpark_number == carparkno) {
            hourIntervalData.push({"timestamp":intervalDateTime,"data":carpark_data[item]});
          }
        }
      }
      res.send({"status":"ok","data":hourIntervalData});
    } else {
      res.send({"status":"invalid_type"});
    }
  }
}
