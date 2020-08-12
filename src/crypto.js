import EC from "elliptic";
import secureRandom from "secure-random";
import coinstring from "coinstring";
import crypto from "crypto";

const ec = new EC.ec("secp256k1");

const DEFAULT_VERSIONS = { public: 0x0, private: 0x80 };

export function Hash(msg) {
  return crypto.createHash("sha256").update(msg).digest();
}

export function getAddress(publicKey) {
  let publicKeyHash = Hash(publicKey);
  return coinstring.encode(publicKeyHash, DEFAULT_VERSIONS.public);
}

export function makeWallet() {
  let privateKey, publicKey, publicKeyHash, key, publicAddress;
  privateKey = secureRandom.randomBuffer(32); // start with random 32 bit hex string
  // generate public key from private
  var keys = ec.keyFromPrivate(privateKey);
  publicKey = keys.getPublic("hex");
  // generate public key hash
  publicKeyHash = Hash(publicKey);
  // generate public address
  publicAddress = coinstring.encode(publicKeyHash, DEFAULT_VERSIONS.public);
  key = {
    privateKey: privateKey.toString("hex"),
    publicKey,
    publicKeyHash: publicKeyHash.toString("hex"),
    publicAddress,
  };
  return key;
}

// makeWallet();
// module.exports = makeWallet;
