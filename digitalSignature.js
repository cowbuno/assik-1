const crypto = require("crypto");

// create a public/private key pair
function generateKeys() {
  const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048, // the length of your key in bits
  });
  return { publicKey, privateKey };
}

// signature using the private key
function signData(data, privateKey) {
  const signer = crypto.createSign("sha256");
  signer.update(data);
  signer.end();
  const signature = signer.sign(privateKey, "hex");
  return signature;
}

// Verifies the signature is valid and was created using the data and the matching public key
function verifySignature(data, signature, publicKey) {
  const verifier = crypto.createVerify("sha256");
  verifier.update(data);
  verifier.end();
  const isVerified = verifier.verify(publicKey, signature, "hex");
  return isVerified;
}

module.exports = {
  generateKeys,
  signData,
  verifySignature,
};
