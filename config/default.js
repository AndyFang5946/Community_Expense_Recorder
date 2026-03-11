module.exports = {
    port: 3000,
    session: {
        secret: 'expense_tracker',
        key: 'expense_tracker',
        maxAge: 2592000000
    },
    mongodb: 'mongodb://localhost:27017/expense-tracker'
}