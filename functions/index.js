const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");
admin.initializeApp();

const ADMIN_EMAIL = "nicholasmaccheyne@gmail.com"; // where order notifications go

const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// When an order is saved, queue an email for the Trigger Email extension.
exports.emailOrder = onDocumentCreated("orders/{id}", async (event) => {
  const o = event.data.data();
  await admin.firestore().collection("mail").add({
    to: ADMIN_EMAIL,
    message: {
      subject: `New sourdough order: ${o.loaves} loaf${o.loaves === 1 ? "" : "ves"} for ${o.pickupDate}`,
      html: `<p><b>${esc(o.name)}</b> (${esc(o.email)}) ordered <b>${o.loaves}</b> loaf${o.loaves === 1 ? "" : "ves"}.</p>
             <p>Pickup: ${esc(o.pickupDate)} at ${esc(o.location)}</p>`,
    },
  });
});
