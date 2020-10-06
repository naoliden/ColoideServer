
function groupby(arr, property){
  const names = {};
  arr.forEach(element => {
    if(!names.hasOwnProperty(element[property])) {
      names[element[property]] = [];
    }
    names[element[property]].push(element)
  });
  return names;
}

module.exports = groupby;