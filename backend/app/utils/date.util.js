exports.getCurrentDate = () => {
    const date = new Date();
    date.setHours(0,0,0,0)
    return date;
}

exports.getCurrentDateTime = () => {
    return new Date();
}

exports.getDate = (dateString) => {
    const [date, month, year] = dateString.split("-")
    return new Date(year, month-1, date);
}