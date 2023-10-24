export const appendZero = (num) => (num < 10 ? `0${num}` : num);

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

export const getFormattedTime = (time, remaning = false) => {
  const dateTime = new Date(0, 0, 0, 0, 0, time, 0);

  const dateTimeH = appendZero(dateTime.getHours());
  const dateTimeM = appendZero(dateTime.getMinutes());
  const dateTimeS = appendZero(dateTime.getSeconds());
  const minus = remaning ? '-' : '';

  return dateTimeH > 0
    ? `${minus}${dateTimeH}:${dateTimeM}:${dateTimeS}`
    : `${minus}${dateTimeM}:${dateTimeS}`;
};

export const getProgress = (currentTime, duration) => {
  if (isNumeric(currentTime) && isNumeric(duration)) {
    return parseFloat((100 * (currentTime / duration)).toString());
  }
  return 0;
};

export const getCurrentTime = (progress, duration) => {
  if (isNumeric(progress) && isNumeric(duration)) {
    return parseFloat(((progress * duration) / 100).toString());
  }
  return 0;
};

export const getRemaningTime = (progress, duration) => {
  if (isNumeric(progress) && isNumeric(duration)) {
    return parseFloat((((100 - progress) * duration) / 100).toString());
  }
  return 0;
};

export const populateDispatch = (dispatch, player, ...funcs) => {
  return funcs.reduce((acc, func) => {
    acc.push(func(dispatch, player));
    return acc;
  }, []);
};