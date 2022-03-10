const { ObjectId } = require("mongodb");

module.exports = {
    Muattion: {
        createToDo: async (_, { content, taskListId }, { db, user }) => {
            if (!user) {
              throw new Error("Authentication Error. Please sign in");
            }
            const newToDo = {
              content,
              taskListId: ObjectId(taskListId),
              isCompleted: false,
            };
            const result = await db.collection("ToDo").insertOne(newToDo);
            const toDo = await db
              .collection("ToDo")
              .findOne({ _id: result.insertedId });
      
            return toDo;
          },
      
          updateToDo: async (_, data, { db, user }) => {
            if (!user) {
              throw new Error("Authentication Error. Please sign in");
            }
            const result = await db.collection("ToDo").updateOne(
              {
                _id: ObjectId(data.id),
              },
              {
                $set: data,
              }
            );
            return await db.collection("ToDo").findOne({ _id: ObjectId(data.id) });
          },
      
          deleteToDo: async (_, { id }, { db, user }) => {
            if (!user) {
              throw new Error("Authentication Error. Please sign in");
            }
            await db.collection("ToDo").deleteOne({ _id: ObjectId(id) });
            return true;
          },
      
    },
    ToDo: {
        id: ({ _id, id }) => _id || id,
        taskList: async ({ taskListId }, _, { db }) =>
          await db.collection("ToDo").findOne({ _id: ObjectId(taskListId) }),
      },
}