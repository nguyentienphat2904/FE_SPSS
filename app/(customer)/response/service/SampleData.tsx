export const SampleData = {
    getData() {
        return [
            {
                id: 1,
                title: "Khiếu nại dịch vụ",
                date: '2024-10-20',
                detail: "Nội dung khiếu nại...",
                reply: null,
            },
            {
                id: 1000,
                title: "Chất lượng in",
                date: '2024-10-20',
                detail: "Nội dung góp ý về chất lượng in",
                reply: "Chúng tôi xin ghi nhận và sẽ cố gắng khắc phục."
            },
        ]
    },
    getFullData() {
        return Promise.resolve(this.getData());
    }
}