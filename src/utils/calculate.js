function calcTimeGap(time) {
  const ObjectTime = Date.parse(new Date(time));
  const now = Date.parse(new Date());
  const milleSecondsPerDay = 24 * 3600 * 1000;
  const gapMilleSeconds = now - ObjectTime;
  const days = gapMilleSeconds / milleSecondsPerDay;
  return Math.floor(days) > 365
    ? `${Math.floor(days / 365)}年`
    : Math.floor(days) > 30
    ? `${Math.floor(days / 30)}個月`
    : Math.floor(days) > 7
    ? `${Math.floor(days / 7)}週`
    : Math.floor(days) >= 1
    ? `${Math.floor(days)}天`
    : Math.floor(days * 24) >= 1
    ? `${Math.floor(days * 24)}小時`
    : Math.floor(days * 24 * 60) >= 1
    ? `${Math.floor(days * 24 * 60)}分鐘`
    : "現在";
}

function checkEventKeyIsNaN(event) {
  return !/[0-9]/.test(event.key);
}

export { calcTimeGap, checkEventKeyIsNaN };
