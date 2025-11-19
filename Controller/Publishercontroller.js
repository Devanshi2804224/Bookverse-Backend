import Publisher from "../Models/Publishermodels.js";

export const getPublishers = async (req, res) => {
  try {
    const publishers = await Publisher.find();
    res.json(publishers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching publishers" });
  }
};

export const addPublisher = async (req, res) => {
  try {
    const { name } = req.body;
    const newPublisher = new Publisher({ name });
    await newPublisher.save();
    res.json(newPublisher);
  } catch (error) {
    res.status(500).json({ message: "Error adding publisher" });
  }
};

export const deletePublisher = async (req, res) => {
  try {
    const { id } = req.params;
    await Publisher.findByIdAndDelete(id);
    res.json({ message: "Publisher deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting publisher" });
  }
};
