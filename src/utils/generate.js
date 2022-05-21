function generateSelectOptionsByAmountNumber(amount) {
  return Array.from(Array(amount).keys()).map((num) => (
    <option key={num} value={num + 1}>
      {num + 1}
    </option>
  ));
}

export { generateSelectOptionsByAmountNumber };
