class DateTime extends Date {
    constructor(isoString) {
        super(isoString);
    }

    getDateTimeString() {
        const options = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }
        const formatedDate = this.toLocaleDateString("vi-Vn", options);
        const h = String(this.getHours()).padStart(2, '0');
        const m = String(this.getMinutes()).padStart(2, '0');
        return `${formatedDate} ${h}:${m}`
    }

    getDateString() {
        const options = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }
        const formatedDate = this.toLocaleDateString("vi-Vn", options);
        return `${formatedDate}`
    }
}

export default DateTime;