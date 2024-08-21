const prodPlugin = [];

if (process.env.NODE_ENV === 'production') {
    prodPlugin.push(['transform-remove-console']);
}

module.exports = {
    plugins: [...prodPlugin],
};
