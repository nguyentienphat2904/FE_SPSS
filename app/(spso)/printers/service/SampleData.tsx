export const SampleData = {
    getData() {
        return [
            {
                id: '1000',
                name: 'M01',
                company: 'Canon',
                type: 'Color',
                numOfPrint: 2,
                status: true,
                activate: false
            },
            {
                id: '1001',
                name: 'M02',
                company: 'Toshiba',
                type: 'Black White',
                numOfPrint: 2,
                status: false,
                activate: true
            },
        ]
    },
    getFullData() {
        return Promise.resolve(this.getData());
    }
}