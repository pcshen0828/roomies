function calcTimeGap(time) {
  const ObjectTime = Date.parse(new Date(time));
  const now = Date.parse(new Date());
  const milleSecondsPerDay = 24 * 3600 * 1000;
  const gapMilleSeconds = now - ObjectTime;
  const gapDays = gapMilleSeconds / milleSecondsPerDay;

  function condition(gapDays) {
    if (Math.floor(gapDays) > 365) {
      return "year";
    } else if (Math.floor(gapDays) > 30) {
      return "month";
    } else if (Math.floor(gapDays) > 7) {
      return "week";
    } else if (Math.floor(gapDays) >= 1) {
      return "day";
    } else if (Math.floor(gapDays * 24) >= 1) {
      return "hour";
    } else if (Math.floor(gapDays * 24 * 60) >= 1) {
      return "minute";
    } else {
      return "now";
    }
  }

  switch (condition(gapDays)) {
    case "year":
      return `${Math.floor(gapDays / 365)}年`;
    case "month":
      return `${Math.floor(gapDays / 30)}個月`;
    case "week":
      return `${Math.floor(gapDays / 7)}週`;
    case "day":
      return `${Math.floor(gapDays)}天`;
    case "hour":
      return `${Math.floor(gapDays * 24)}小時`;
    case "minute":
      return `${Math.floor(gapDays * 24 * 60)}分鐘`;
    case "now":
      return "現在";
    default:
      return "Invalid time";
  }
}

function checkEventKeyIsNaN(event) {
  return !/[0-9]/.test(event.key);
}

export { calcTimeGap, checkEventKeyIsNaN };
