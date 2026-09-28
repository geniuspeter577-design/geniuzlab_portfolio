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
import {
  getDefaultImageProvider,
  getFileSizeLimit,
  isValidMediaContent,
  isValidMediaFile,
  isValidMediaFilename,
  uploadImage,
} from "../lib/image-upload";

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

router.post("/upload-image", (req, res) => {
  upload.single("file")(req, res, (uploadError) => {
    if (uploadError instanceof multer.MulterError) {
      const tooLarge = uploadError.code === "LIMIT_FILE_SIZE";
      res.status(tooLarge ? 413 : 400).json({
        error: tooLarge ? "File size must be 50MB or less." : "Invalid media upload.",
      });
      return;
    }

    if (uploadError) {
      res.status(400).json({ error: "Invalid media upload." });
      return;
    }

    const file = req.file;
    if (!file) {
      res.status(400).json({ error: "No file provided." });
      return;
    }

    const isVideo = file.mimetype.startsWith("video/");
    if (
      !isValidMediaFile(file.mimetype, true) ||
      !isValidMediaFilename(file.originalname, file.mimetype) ||
      !isValidMediaContent(file.buffer, file.mimetype)
    ) {
      res.status(415).json({ error: "Unsupported media type or file extension." });
      return;
    }

    const maxSize = Math.min(getFileSizeLimit(getDefaultImageProvider()), 50 * 1024 * 1024);
    if (file.size > maxSize) {
      res.status(413).json({ error: "File size must be 50MB or less." });
      return;
    }

    const safeFilename = file.originalname.replace(/[\\/]/g, "_").replace(/[^a-zA-Z0-9._-]/g, "_");
    void uploadImage(file.buffer, safeFilename, undefined, {
      folder: "geniuzlab-portfolio",
      isVideo,
      mimeType: file.mimetype,
    })
      .then((result) => res.json(result))
      .catch((error: unknown) => {
        console.error("Media upload failed:", error);
        const storageMissing = error instanceof Error && error.message === "BLOB_READ_WRITE_TOKEN is not configured";
        res.status(storageMissing ? 503 : 502).json({
          error: storageMissing ? "Media storage is not configured." : "Media upload failed. Please try again.",
        });
      });
  });
});

export default router;
