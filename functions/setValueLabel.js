function setValueLabel(arr){

  return arr.reduce( (acc, item) => {
    values = {}
    values["label"] = `${item.firstname} ${item.lastname}`;
    values["value"] = item.user_id;
    acc.push(values);
    return acc;
  }, [])

}

module.exports = setValueLabel;