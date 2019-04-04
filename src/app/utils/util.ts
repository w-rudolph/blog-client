export function createFormData(obj: object): FormData {
  const data = new FormData();
  Object.keys(obj).forEach(k => {
    data.append(k, obj[k]);
  });
  return data;
}

export function timeago(date: Date) {
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const month = 31 * day;
  const year = 12 * month;

  const diff = Date.now() - date.getTime();

  if (diff > year) {
    return (diff / year).toFixed(0) + '年前';
  }
  if (diff > month) {
    return (diff / month).toFixed(0) + '个月前';
  }
  if (diff > day) {
    return (diff / day).toFixed(0) + '天前';
  }
  if (diff > hour) {
    return (diff / hour).toFixed(0) + '小时前';
  }
  if (diff > minute) {
    return (diff / minute).toFixed(0) + '分钟前';
  }
  return '刚刚';
}

export function formatTime(fotmat: string, date: Date) {
  const o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    S: date.getMilliseconds()
  };
  if (/(y+)/.test(fotmat)) {
    fotmat = fotmat.replace(
      RegExp.$1,
      (date.getFullYear() + '').substr(4 - RegExp.$1.length)
    );
  }
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(fotmat)) {
      fotmat = fotmat.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      );
    }
  }
  return fotmat;
}
