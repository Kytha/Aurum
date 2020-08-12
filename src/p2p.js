import EventEmitter from "events";

class P2p extends EventEmitter {}

const p2p = new P2p();

export function connectToPeer(fromPeer, toPeer) {
  p2p.emit("connect", fromPeer, toPeer);
}

export function incomingConnection(cb) {
  p2p.on("connect", cb);
}

export function disconnectFromPeer(fromPeer, toPeer) {
  p2p.emit("disconnect", fromPeer, toPeer);
}

export function disconnectingConnection(cb) {
  p2p.on("disconnect", cb);
}

export function sendData(fromPeer, toPeer, data) {
  p2p.emit("data", fromPeer, toPeer, data);
}

export function incomingData(cb) {
  p2p.on("data", cb);
}

export function removeConnectListener(cb) {
  p2p.removeListener("connect", cb);
}

export function removeDisconnectListener(cb) {
  p2p.removeListener("disconnect", cb);
}

export function removeDataListener(cb) {
  p2p.removeListener("data", cb);
}

// WEBPACK FOOTER //
// ./src/p2p.js
