export const formatNumberToVnd = number => {
  return Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
}

export const isObjectNullOrEmpty = data => {
  return !data || Object.keys(data).length === 0;
}

export const formatDate = (dateTimeString) => {
  const date = new Date(dateTimeString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${day}-${month}-${year}`;
}

export const formatDateToDDMMYYYY = (date, charStr = "/") => {
  if (date) {
    const dateStr = new Date(date).toLocaleDateString("vi-VN");
    const datrStrArr = dateStr.split("/");
    return datrStrArr[0].padStart(2, "0") + charStr + datrStrArr[1].padStart(2, "0") + charStr + datrStrArr[2];
  } else {
    return "";
  }
}
