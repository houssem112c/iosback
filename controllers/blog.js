const boutique = require("../models/blog");

const ObjectId = require("mongodb").ObjectId;


exports.addproject = (req, res) => {
  let newboutique = new boutique({ ...req.body, imageRes: req.file.filename });

  newboutique.save((erro, newboutique) => {
    if (erro) {
      return res.status(400).json({
        error: "unable to add product",
      });
    }
    return res.json({
      message: "sucsess",
      newboutique,
    });
  });
  console.log(newboutique);
};
exports.allProject = async (req, res) => {
  try {
    const projects = await boutique.find();

    // Check if there is at least one project
    if (projects.length > 0) {
      // Format projects to match the expected structure
      const formattedProjects = projects.map(project => ({
        id: project._id, // or however you store your project ID
        imageRes: project.imageRes, // adjust accordingly
        title: project.title,
        description: project.description,
        path: project.path,
      }));

      // Send the formatted projects as a JSON response
      res.json(formattedProjects);
    } else {
      res.status(404).json({ message: 'No projects found' });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

