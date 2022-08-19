module.exports = (req, res) => {
    res.send = (data) => {
        res.writeHead(200, {
            'Content-type': 'application/json'
        })
        res.end(JSON.stringify(data));
    }
}