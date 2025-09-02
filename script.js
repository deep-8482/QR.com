
function showForm(type) {
  // Hide all forms
  document.querySelectorAll(".form").forEach(form => {
    form.style.display = "none";
  });

  // Show selected form
  document.getElementById(type + "-form").style.display = "block";

  // Clear previous QR code & hide download button
  document.getElementById("qrcode").innerHTML = "";
  document.getElementById("downloadBtn").style.display = "none";
}

function generateQR(type) {
  let qrData = "";

  if (type === "url") {
    qrData = document.getElementById("urlInput").value;
  } else if (type === "text") {
    qrData = document.getElementById("textInput").value;
  } else if (type === "phone") {
    let name = document.getElementById("phoneName").value;
    let number = document.getElementById("phoneNumber").value;
    qrData = `Name: ${name},
Phone: ${number}`;
  } else if (type === "email") {
    qrData = document.getElementById("emailInput").value;
  } else if (type === "contact") {
    let name = document.getElementById("contactName").value;
    let phone = document.getElementById("contactPhone").value;
    let email = document.getElementById("contactEmail").value;
    qrData = `Name: ${name},
Phone: ${phone},
Email: ${email}`;
  }

  // Clear old QR
  document.getElementById("qrcode").innerHTML = "";

  // Generate raw QR inside hidden container
  let tempDiv = document.createElement("div");
  new QRCode(tempDiv, {
    text: qrData,
    width: 256,
    height: 256,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H,
    useSVG: false
  });

  // Get raw canvas from QRCode.js
  let qrCanvas = tempDiv.querySelector("canvas");

  // Create new canvas with branding
  let padding = 20;
  let canvas = document.createElement("canvas");
  canvas.width = qrCanvas.width + padding * 2;
  canvas.height = qrCanvas.height + padding * 2;
  let ctx = canvas.getContext("2d");

  // White background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw QR
  ctx.drawImage(qrCanvas, padding, padding);

  // Border
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 4;
  ctx.strokeRect(2, 2, canvas.width - 4, canvas.height - 4);

  // ✅ Add brand text inside QR bottom-right
  ctx.font = "bold 14px Arial";
  ctx.fillStyle = "#000000";
  ctx.textAlign = "right";
  ctx.fillText("Deep Mistry", canvas.width - 8, canvas.height - 8);

  // Show branded QR in preview
  document.getElementById("qrcode").innerHTML = "";
  document.getElementById("qrcode").appendChild(canvas);

  // Show download button
  document.getElementById("downloadBtn").style.display = "inline-block";
}

function downloadQR() {
  let qrCanvas = document.querySelector("#qrcode canvas");
  if (!qrCanvas) return;

  // Convert current preview canvas (already branded) into PNG
  let link = document.createElement("a");
  link.href = qrCanvas.toDataURL("image/png");
  link.download = "qrcode.png";
  link.click();
}

// URL input validation
const urlInput = document.getElementById("urlInput");
const urlError = document.getElementById("urlError");

urlInput.addEventListener("input", function () {
  let value = this.value.trim();
  let urlPattern = /^(https?:\/\/)[\w.-]+(\.[\w\.-]+)+[/#?]?.*$/;

  if (value.length > 0 && !urlPattern.test(value)) {
    urlError.style.display = "block";
  } else {
    urlError.style.display = "none";
  }
});
