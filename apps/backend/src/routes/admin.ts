import { Router } from "express";
import multer from "multer";
import { requireAuth } from "../middleware/requireAuth";
import {
  adminProjectSchema,
  createProject,
  deleteProject,
  getAdminCategories,
  getProjectForAdmin,
  listProjectsForAdmin,
  updateProject,
} from "../lib/admin-projects";
import { uploadImage } from "../lib/image-upload";

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });

router.use(requireAuth);

router.get("/categories", async (_req, res) => {
  const categories = await getAdminCategories();
  res.json({ categories });
});

router.get("/projects", async (_req, res) => {
  const projects = await listProjectsForAdmin();
  res.json({ projects });
});

router.post("/projects", async (req, res) => {
  try {
    const result = adminProjectSchema.parse(req.body);
    const project = await createProject(result);
    res.status(201).json({ project });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid project payload";
    res.status(400).json({ error: message });
  }
});

router.get("/projects/:id", async (req, res) => {
  const project = await getProjectForAdmin(req.params.id);

  if (!project) {
    res.status(404).json({ error: "Project not found" });
    return;
  }

  res.json({ project });
});

router.put("/projects/:id", async (req, res) => {
  try {
    const result = adminProjectSchema.parse(req.body);
    const project = await updateProject(req.params.id, result);
    res.status(200).json({ project });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid project payload";
    res.status(400).json({ error: message });
  }
});

router.delete("/projects/:id", async (req, res) => {
  await deleteProject(req.params.id);
  res.status(200).json({ success: true });
});

router.post("/upload-image", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      res.status(400).json({ error: "No file provided" });
      return;
    }

    if (!file.mimetype.startsWith("image/") && !file.mimetype.startsWith("video/")) {
      res.status(400).json({ error: "File must be an image or video" });
      return;
    }

    const result = await uploadImage(file.buffer, file.originalname, undefined, {
      folder: "geniuzlab-portfolio",
      isVideo: file.mimetype.startsWith("video/"),
    });

    res.json(result);
  } catch (error) {
    console.error("Image upload error:", error);
    res.status(500).json({
      error: error instanceof Error ? error.message : "Failed to upload image",
    });
  }
});

export default router;
