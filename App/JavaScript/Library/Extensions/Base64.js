function Base64Encode(string) {
  return btoa(unescape(encodeURIComponent(string)));
}

function Base64Decode(string) {
  return decodeURIComponent(escape(atob(string)));
}
