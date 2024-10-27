export const SampleData = {
    getData() {
        return [
            {
                id: 1000,
                number: 10,
                date: '2024-10-20',
                paid: true,
            },
            {
                id: 1000,
                number: 20,
                date: '2024-10-20',
                paid: true,
            },
        ]
    },
    getFullData() {
        return Promise.resolve(this.getData());
    }
}