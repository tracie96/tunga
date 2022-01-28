import { useForm } from "react-hook-form";
import "./style.css";
import React from "react";

export default function Form() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const { REACT_APP_API_KEY} = process.env;

  const [address, setAddress] = React.useState("Norway");
  const [data, setData] = React.useState();
  const onSubmit = (event) => {
    event.preventDefault();

    const api_key = REACT_APP_API_KEY;
    console.log("api",api_key)
    const newaddress = address;
    console.log(newaddress);

    var api_url = "https://api.opencagedata.com/geocode/v1/json";

    var request_url =
      api_url +
      "?" +
      "key=" +
      api_key +
      "&q=" +
      encodeURIComponent(address) +
      "&pretty=1" +
      "&no_annotations=1";

    // see full list of required and optional parameters:
    // https://opencagedata.com/api#forward
    fetch(request_url)
      .then((response) => response.json())
      .then((data) => setData(data));

    // .then(data => data.results.map(a=>{
    //     console.log(a.bounds)
    // }));
    var request = new XMLHttpRequest();
    request.open("GET", request_url, true);

    request.onload = function () {
      if (request.status === 200) {
        // Success!
        var data = JSON.parse(request.responseText);
        alert(data.results[0].formatted.result); // print the location
        console.log(data.results);
      } else if (request.status <= 500) {
        // We reached our target server, but it returned an error

        console.log("unable to geocode! Response code: " + request.status);
        var data = JSON.parse(request.responseText);
        console.log("error msg: " + data.status.message);
      } else {
        console.log("server error");
      }
    };

    request.onerror = function () {
      // There was a connection error of some sort
      console.log("unable to connect to server");
    };
  }; // your form submit function which will invoke after successful validation

  return (
    <div>
      <form onSubmit={onSubmit}>
        <label>Address</label>
        <input
          name="Address"
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />

        <input type="submit" />
      </form>
      <div style={{ display: "flex", width: "100%" }}>
        <table  className="customers">
          <tr>
            <th style={{textAlign:"center"}}>NorthEast</th>
            <th style={{textAlign:"center"}}>SouthWest</th>
          </tr>
          {data
            ? data.results.map((a) => (
                <tr>
                  <td>{a.bounds.northeast.lat}</td>

                  <td>{a.bounds.northeast.lng}</td>
                </tr>
              ))
            :  <tr>
                  <td>----</td>

                  <td>----</td>
                </tr>}
        </table>
      </div>
    </div>
  );
}
