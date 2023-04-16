 function setTime(dateData) {
  let date = new Date(dateData);
  let y = date.getFullYear();
  let m = date.getMonth() + 1;
  m = m < 10 ? "0" + m : m;
  let d = date.getDate();
  d = d < 10 ? "0" + d : d;
  const time_end = y + "-" + m + "-" + d;
  return time_end;
};

// console.log(time("Tue Apr 25 2023 00:00:00 GMT+0800 (中国标准时间)"));


function rTime(date) {
  var json_date = new Date(date).toJSON();
  console.log(json_date.toString().slice(10,11)==='T');
  return new Date(new Date(json_date) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '') 
}
const time = function processTime(string) {
  var res
  if (string.toString().slice(10, 11) === 'T') {
    res=rTime(string)
  }
  res = setTime(string)
  return res;
}
// let date = rTime('2020-06-27T14:20:27.000000Z');
// console.log(date) // 2020-06-27 14:20:27
// console.log(time('2020-06-27T14:20:27.000000Z'));
// console.log(time("Tue Apr 25 2023 00:00:00 GMT+0800 (中国标准时间)"));
module.exports = time;

