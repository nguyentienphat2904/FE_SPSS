export const SampleData = {
    getData() {
        return [
            {
                id: 1000,
                name: 'CNPM-01',
                date: '2024-10-20',
                location: 'H6-107',
                paid: true,
                status: true
            },
            {
                id: 1001,
                name: 'CNPM',
                date: '2024-10-25',
                location: 'H6-107',
                paid: true,
                status: false
            },
            {
                id: 1002,
                name: 'CNPM',
                date: '2024-10-22',
                location: 'H6-107',
                paid: false,
                status: false
            },
            {
                id: 1003,
                name: 'CNPM',
                date: '2024-10-23',
                location: 'H6-107',
                paid: false,
                status: true
            },
            {
                id: 1004,
                name: 'CNPM',
                date: '2024-10-21',
                location: 'H6-107',
                paid: true,
                status: true
            },
        ]
    },
    getFullData() {
        return Promise.resolve(this.getData());
    }
}