let db;
const dbConnection = async () => {
    try {
        const { MongoClient } = require("mongodb");
        require("dotenv").config();
        const connStr = process.env.MONGODB_CONN_STR;
        const client = new MongoClient(connStr);
        await client.connect();
        db = client.db();
        // await db.createCollection("Tasks");
        // await db.createCollection("counter");
        // await db.collection("counter").insertOne({
        //     id: "todoApp",
        //     taskCount: 0,
        // });
        console.log("Database Connected!");
    } catch (e) {
        console.error(e);
    }
}

const resolvers = {
    Query: {
        async tasks() {
            const taskList = await db.collection("Tasks");
            const allTasks = await taskList.find({}).toArray();
            console.log(allTasks);
            return allTasks;
        }
    },

    Mutation: {
        async insertTask(_, { taskName }) {
            const counter = await db.collection("counter");

            // updating the task counter when the new task is added
            const updateCounter = await counter.findOneAndUpdate({ id: "todoApp" }, {
                $inc: { taskCount: 1 }
            }, { returnDocument: "after" });

            const taskList = await db.collection("Tasks");
            // setting the id to be the current counter value
            const taskId = updateCounter.taskCount;
            const addTask = await taskList.insertOne({
                id: taskId,
                taskName
            });

            const newTask = await db.collection("Tasks").findOne({ _id: addTask.insertedId });
            console.log(newTask);
            return newTask;
        },

        async updateTask(_, { id, taskName }) {
            const taskList = await db.collection("Tasks");
            console.log(id);
            await taskList.findOneAndUpdate({ id: id }, {
                $set: { id, taskName }
            }, {returnDocument: "after", upsert: true});

            const allTasks = await taskList.find({}).toArray();
            console.log(allTasks);
            return allTasks;
        },

        async deleteTask(_, { id }) {
            const taskList = await db.collection("Tasks");
            const counter = await db.collection("counter");
            await taskList.findOneAndDelete({ id: id });
            // decreasing the count when a task is deleted
            await counter.updateOne({ id: "todoApp" }, {
                $inc: { taskCount: -1 }
            });
            const allTasks = await taskList .find({}).toArray();
            console.log(allTasks);
            return allTasks;
        }
    }
}

module.exports = { dbConnection, resolvers };