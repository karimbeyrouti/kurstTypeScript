class GeoData {
    init() {
        // date format: yyyymmdd;
        if (this.dateString.length === 8) {
            var date = this.dateString;
            var y = parseInt(date.slice(0, 4));
            var m = parseInt(date.slice(4, 6));
            var d = parseInt(date.slice(6, 8));
            this.date = new Date();
            this.date.setFullYear(y, m - 1, d);
        }
    }
}
