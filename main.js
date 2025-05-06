let myh2 = document.querySelector("h2");
const time = function clock() {
  let dat = new Date();
  let seconds = dat.getSeconds().toString().padStart(2, "0");
  let minutes = dat.getMinutes().toString().padStart(2, "0");
  let hours = dat.getHours();
  let mytxt = "";
  if (hours >= 12) {
    hours -= 12;
    mytxt = "pm";
  } else {
    mytxt = "am";
  }

  if (hours === 0) {
    hours = 12;
  }

  let hours12padded = hours.toString().padStart(2, "0");
  myh2.innerHTML = `${hours12padded}:${minutes}:${seconds} ${mytxt}`;
};

setInterval(time, 1000);
time();
