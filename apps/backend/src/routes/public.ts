import { Router } from "express";
import { getPublicProjectBySlug, listPublicProjects } from "../lib/public-projects";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const category = typeof req.query.category === "string" ? req.query.category : undefined;
    const projects = await listPublicProjects(category);
    res.json({ projects });
  } catch (error) {
    next(error);
  }
});

router.get("/:slug", async (req, res, next) => {
  try {
    const project = await getPublicProjectBySlug(req.params.slug);

    if (!project) {
      res.status(404).json({ error: "Project not found" });
      return;
    }

    res.json({ project });
  } catch (error) {
    next(error);
  }
});

export default router;
