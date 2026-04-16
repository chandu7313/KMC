import express from "express";
import { createRequest, getRequests, assignExpert } from "../controllers/orchardRequestController.js";
import upload from "../middleware/uploadMiddleware.js";
import adminAuth from "../middleware/adminAuth.js";

const orchardRouter = express.Router();

// Public / User route
orchardRouter.post('/request', upload.array('media', 4), createRequest);

// Admin routes
orchardRouter.get('/admin-requests', adminAuth, getRequests);
orchardRouter.put('/assign/:id', adminAuth, assignExpert);

export default orchardRouter;
