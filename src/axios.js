import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:9000", //https://whatsappbackend434.herokuapp.com
});

export default instance;
