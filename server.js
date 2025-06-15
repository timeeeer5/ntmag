const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// 정적 파일 서빙
app.use('/output', express.static(__dirname));

app.post('/generate', (req, res) => {
  const { text, filename } = req.body;
  const safeFilename = filename || 'output.mp4';

  const command = `ffmpeg -f lavfi -i color=c=black:s=720x1280:d=5 -vf "drawtext=text='${text}':fontcolor=white:fontsize=50:x=(w-text_w)/2:y=(h-text_h)/2" -y ${safeFilename}`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).send({ error: stderr });
    }
    res.send({
      message: 'Video created',
      file: safeFilename,
      video_url: `https://${req.headers.host}/output/${safeFilename}`
    });
  });
});

app.get('/', (req, res) => {
  res.send('FFmpeg API is working!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
