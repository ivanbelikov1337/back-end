import express, {Express, Request, Response} from 'express'

interface IPersonModel {
    id: number
    name: string
}

const app: Express = express()
const port = 3000

const HTTP_STATUSES = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,

    BAD_REQUEST_400: 400,
    NOT_FOUND_404: 404
}

const jsonBodyMiddleware = express.json()
app.use(jsonBodyMiddleware)

const db = {
    courses: [
        {id: 1, name: "ivan"},
        {id: 2, name: "olha"},
        {id: 3, name: "bogdan"},
        {id: 4, name: "oleksander"},
    ]
}

app.get("/", (req: Request, res: Response) => {
    res.send({message: 'Hello World!'})
})

app.get("/users", (req: Request, res: Response) => {
    res.json(db.courses).sendStatus(HTTP_STATUSES.OK_200)
})

app.get("/user", (req: Request, res: Response) => {
    const foundedName = db.courses.filter(item => item.name.indexOf(req.query.name as string) > -1)
    res.json(foundedName)
})

app.get("/user/:id", (req: Request, res: Response) => {
    const foundedId = db.courses.find(c => c.id === Number(req.params.id));

    if (!foundedId) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }
    res.json(foundedId)
})

app.post("/user", (req: Request<{}, {}, IPersonModel>, res: Response) => {
    if (!req.body.name) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
        return
    }

    const creatNewUser = {
        id: +(new Date()),
        name: req.body.name
    }

    db.courses.push(creatNewUser)
    res.status(HTTP_STATUSES.CREATED_201).send(creatNewUser)
})

app.delete("/user/:id", (req: Request, res: Response) => {
    db.courses = db.courses.filter(c => c.id !== +req.params.id);

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})

app.put("/user/:id", (req: Request, res: Response) => {
    if (!req.body.name) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
        return
    }

    const foundedId = db.courses.find(c => c.id === Number(req.params.id));
    if (!foundedId) {
        res.sendStatus(404)
        return
    }

    foundedId.name = req.body.name

    res.sendStatus(204)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

