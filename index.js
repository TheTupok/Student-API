const PORT = process.env.PORT || 5000;
const Application = require('./framework/Application');
const userRouter = require('./src/user-router')
const jsonParser = require('./framework/parsejson')
const parseUrl = require('./framework/parseUrl')

const app = new Application();

app.use(jsonParser);
app.use(parseUrl('http://localhost:5000'));

app.addRouter(userRouter)

app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`))