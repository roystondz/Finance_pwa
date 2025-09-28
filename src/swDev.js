function swDev() {
    let swURL = `${process.env.PUBLIC_URL}/sw.js`;
    navigator.serviceWorker
      .register(swURL)
      .then((res) => {
        console.log("service worker registered");
      })
      .catch((err) => {
        console.log("service worker not registered or Notification access not granted", err);
      });
  }
  
  export default swDev;
  