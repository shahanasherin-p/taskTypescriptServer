const tasks =require("../models/taskModel");



exports.addTaskController=async(req,res)=>{
    console.log("inside addTaskController");
    const userId=req.userId
    console.log(userId);
    const {title,description,status,progress} =req.body
    console.log(title,description,status,progress);
    try {
        const existingTask = await tasks.findOne({title})
        if(existingTask){
            res.status(406).json("task already exist in our collection ..Please upload another")
        }else{
            const newtask = new tasks({
                title,description,status,progress,userId
            })
            await newtask.save()
            res.status(200).json(newtask)
        }
    } catch (error) {
        res.status(401).json(error)
    } 
}
exports.getAllTaskController=async(req,res)=>{
    console.log("inside getAllTaskController");
    const userId=req.userId
    try {
        const alltasks=await tasks.find({userId})
        res.status(200).json(alltasks)
    } catch (error) {
        res.status(401).json(error)
    }
}

exports.deleteTaskController=async(req,res)=>{
    console.log("inside deleteTaskController");
    const {id}=req.params
    try {
        const deletedTask = await tasks.findOneAndDelete({_id:id})
        console.log("deleted task");
        res.status(200).json(deletedTask)
    } catch (error) {
        res.status(401).json(error)
    }
}


exports.updateTaskController = async (req, res) => {
    console.log("Inside updateTaskController");

    const id = req.params.id;
    const userId = req.userId;
    const { title, description, status, progress } = req.body;

    console.log("Task ID:", id);
    console.log("User ID:", userId);
    console.log("Update Data:", { title, description, status, progress });

    if (!userId) {
        console.log("User ID is null");
        return res.status(401).json("Authorization failed... user ID missing");
    }

    try {
        const existingTask = await tasks.findById(id);
        if (!existingTask) {
            console.log("Task not found");
            return res.status(404).json({ message: "Task not found" });
        }

        const updateTask = await tasks.findByIdAndUpdate(
            id,
            { title, description, status, progress, userId },
            { new: true }
        );

        console.log("Updated Task:", updateTask);

        res.status(200).json(updateTask);
    } catch (error) {
        console.error("Error updating task:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};



exports.getTaskById = async (req, res) => {
    const id = req.params.id;
    const userId = req.userId;
  
    try {
      const task = await tasks.findOne({ _id: id, userId: userId });
  
      if (!task) {
        console.log("Task not found");
        return res.status(404).json({ message: "Task not found" });
      }
  
      res.status(200).json(task);
    } catch (error) {
      console.error("Error fetching task:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };