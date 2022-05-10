module.exports = {
  valuesHandler(value, size) {
    const handle = value.toString();
    const toFill = size - handle.length;

    if (toFill <= 0) return handle;
    const formatted = " ".repeat(toFill);

    return formatted.concat(handle);
  }
}
