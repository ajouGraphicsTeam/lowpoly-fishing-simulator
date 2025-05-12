Array.prototype.flatten = function () {
  return flatten(this);
};
Object.defineProperty(Array.prototype, "X", {
  get: function () {
    return this[0]; // 배열의 첫 번째 요소 반환
  },
  set: function (value) {
    this[0] = value;
  },
});
Object.defineProperty(Array.prototype, "Y", {
  get: function () {
    return this[1]; // 배열의 두 번째 요소 반환
  },
  set: function (value) {
    this[1] = value;
  },
});
Object.defineProperty(Array.prototype, "Z", {
  get: function () {
    return this[2]; // 배열의 세 번째 요소 반환
  },
  set: function (value) {
    this[2] = value;
  },
});
