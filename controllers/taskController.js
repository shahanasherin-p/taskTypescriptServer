const tasks =require("../models/taskModel");


exports.addTaskController = async (req, res) => {
    console.log("Inside addTaskController");
    
    const userId = req.userId;
    console.log(userId);
    
    const { title, description, status, progress } = req.body;
    const taskImage = req.file ? req.file.filename : null;
    
    console.log(title, description, status, progress, taskImage);
    
    try {
        // Check if a task with the same title already exists
        const existingTask = await tasks.findOne({ title, userId });
        
        if (existingTask) {
            return res.status(406).json({ 
                message: "A task with this title already exists in your collection. Please use a different title." 
            });
        }
        
        // Validate required fields
        if (!title || !description || !status || progress === undefined) {
            return res.status(400).json({ 
                message: "All fields (title, description, status, progress) are required" 
            });
        }
        
        // Validate progress (assuming it should be between 0 and 100)
        if (progress < 0 || progress > 100) {
            return res.status(400).json({ 
                message: "Progress must be between 0 and 100" 
            });
        }
        
        // Create new task
        const newTask = new tasks({
            title,
            description,
            status,
            progress,
            taskImage: taskImage || '', // Ensure a default empty string if no image
            userId
        });
        
        // Save the task
        await newTask.save();
        
        res.status(201).json({
            message: "Task created successfully",
            task: newTask
        });
        
    } catch (error) {
        console.error("Error in addTaskController:", error);
        res.status(500).json({ 
            message: "Internal server error", 
            error: error.message 
        });
    }
};


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
    const taskImage = req.file ? req.file.filename : req.body.taskImage; 
    console.log("Task ID:", id);
    console.log("User ID:", userId);
    console.log("Update Data:", { title, description, status, progress,taskImage });

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

        // Only update the image if a new one is provided, otherwise keep the old one
        const updatedData = {
            title,
            description,
            status,
            progress,
            userId,
            taskImage: taskImage ? taskImage : existingTask.taskImage  // Use the existing image if no new one is provided
        };

        const updateTask = await tasks.findByIdAndUpdate(id, updatedData, { new: true });

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

exports.getAllTasks = async (req, res) => {

    console.log("Inside getAllBlogPosts ");

    try {
        const posts = await tasks.find().sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: "Error fetching blog posts", error });
    }
};