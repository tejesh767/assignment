const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const fs = require('fs');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const upload = multer({ dest: 'uploads/' });

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

let db;

(async () => {
  db = await open({
    filename: './database.db',
    driver: sqlite3.Database,
  });
  await db.exec(`
    CREATE TABLE IF NOT EXISTS videos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      description TEXT,
      thumbnail TEXT,
      video TEXT
    )
  `);
})();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/upload', upload.fields([{ name: 'thumbnail' }, { name: 'video' }]), async (req, res) => {
  const { title, description } = req.body;
  const { thumbnail, video } = req.files;

  console.log('Request body:', req.body);
  console.log('Files received:', req.files);

  if (!thumbnail || !video) {
    return res.status(400).json({ error: 'Thumbnail and video files are required' });
  }

  try {
    const thumbnailUpload = await cloudinary.uploader.upload(thumbnail[0].path, {
      resource_type: 'image',
    });

    const videoUpload = await cloudinary.uploader.upload(video[0].path, {
      resource_type: 'video',
    });

    await db.run(
      'INSERT INTO videos (title, description, thumbnail, video) VALUES (?, ?, ?, ?)',
      [title, description, thumbnailUpload.secure_url, videoUpload.secure_url]
    );

    fs.unlinkSync(thumbnail[0].path);
    fs.unlinkSync(video[0].path);

    res.status(200).json({ message: 'Upload successful' });
  } catch (error) {
    console.error('Error uploading', error);
    res.status(500).json({ error: 'Upload failed', details: error.message });
  }
});

app.get('/videos', async (req, res) => {
  try {
    const videos = await db.all('SELECT * FROM videos');
    res.json(videos);
  } catch (error) {
    console.error('Error fetching videos', error);
    res.status(500).json({ error: 'Failed to fetch videos', details: error.message });
  }
});

app.get('/videos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const video = await db.get('SELECT * FROM videos WHERE id = ?', id);
    if (video) {
      res.json(video);
    } else {
      res.status(404).json({ error: 'Video not found' });
    }
  } catch (error) {
    console.error('Error fetching video', error);
    res.status(500).json({ error: 'Failed to fetch video', details: error.message });
  }
});

const PORT = process.env.PORT || 10000;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} is already in use. Trying another port...`);
    server.listen(0);  
  } else {
    throw error;
  }
});

server.on('listening', () => {
  const address = server.address();
  console.log(`Server is running on port ${address.port}`);
});
