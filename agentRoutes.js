import express from "express";
import Agent from "../models/Agent.js";

const router = express.Router();

// Add a new agent
router.post("/add", async (req, res) => {
  const { name, email, mobile, password } = req.body;

  try {
    const agent = new Agent({ name, email, mobile, password });
    await agent.save();
    res.status(201).json({ message: "Agent created successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error creating agent" });
  }
});

// List all agents
router.get("/list", async (req, res) => {
  try {
    const agents = await Agent.find();
    res.json(agents);
  } catch (err) {
    res.status(500).json({ message: "Error fetching agents" });
  }
});

export default router;
