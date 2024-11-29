exports.handler = async (event) => {
    const name = event.name || 'World';
    return {
        statusCode: 200,
        body: JSON.stringify({ message: `Hello, ${name}!` }),
    };
};
