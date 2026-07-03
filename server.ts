import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import fs from "fs";

const dataFilePath = path.join(process.cwd(), "data.json");
const defaultNeighborhoods = [
  { id: '1', newName: 'Khu phố Tân An', oldNames: ['Khóm 1', 'Khóm 2'], area: 2.56, households: 1120, population: 4893, leader: 'Nguyễn Thị Vân Nhung', phone: '0903304060', address: 'Quốc lộ 30, tổ 7, khu phố Tân An (trụ sở Khóm 1 cũ)' },
  { id: '2', newName: 'Khu phố Trần Quốc Toản', oldNames: ['Khóm 3', 'Khóm 5'], area: 2.83, households: 1115, population: 4938, leader: 'Lê Hoàng Vinh', phone: '0939703435', address: 'Số 71, đường Tân Định, tổ 21, khu phố Trần Quốc Toản (trụ sở Khóm 3 cũ)' },
  { id: '3', newName: 'Khu phố Tân Định', oldNames: ['Khóm 4', 'Khóm 6'], area: 4.26, households: 1198, population: 5083, leader: 'Nguyễn Văn Sang', phone: '0988165716', address: 'Đường Lưu Kim Phong, Tổ 32, khu phố Tân Định (trụ sở Khóm 4 cũ)' },
  { id: '4', newName: 'Khu phố Mỹ Phước', oldNames: ['Khóm 7', 'Khóm 8'], area: 4.77, households: 927, population: 4064, leader: 'Võ Thanh Hòa', phone: '0939537767', address: 'Đường Nguyễn Chí Thanh, khu phố Mỹ Phước (trụ sở Khóm 7 cũ)' },
  { id: '5', newName: 'Khu phố Tân Nhất', oldNames: ['Khóm 9'], area: 2.45, households: 1327, population: 5753, leader: 'Lê Thị Bạch Ngọc', phone: '0396949060', address: 'Tổ 15, đường ấp Chiến Lược, khu phố Tân Nhất (trụ sở Khóm 9 cũ)' },
  { id: '6', newName: 'Khu phố Mỹ Tân', oldNames: ['Khóm 10'], area: 2.54, households: 829, population: 3709, leader: 'Nguyễn Văn Trưởng', phone: '0988522833', address: 'Khu dân cư Bà Học, đường số 4, tổ 12, khu phố Mỹ Tân (trụ sở Khóm 10 cũ)' },
  { id: '7', newName: 'Khu phố Mỹ Phong', oldNames: ['Khóm 11'], area: 1.78, households: 935, population: 3852, leader: 'Hồ Bảo Triệu Duy', phone: '0907466586', address: 'Số 39 đường số 2, tổ 3, khu phố Mỹ Phong (trụ sở Khóm 11 cũ)' },
  { id: '8', newName: 'Khu phố Mỹ Lợi', oldNames: ['Khóm 12'], area: 3.89, households: 885, population: 4293, leader: 'Lê Văn Phú Quý', phone: '0768506711', address: 'Đường Bà Học bờ trên, Tổ 7, khu phố Mỹ Lợi (trụ sở Khóm 12 cũ)' },
  { id: '9', newName: 'Khu phố Tân Tiến', oldNames: ['Khóm 13'], area: 8.55, households: 716, population: 3338, leader: 'Nguyễn Văn Mơ', phone: '0899308970', address: 'Tổ 12, đường Ngã Đồng, khu phố Tân Tiến (trụ sở Khóm 13 cũ, gần bến đò 5 Vui)' },
  { id: '10', newName: 'Khu phố Tân Nghĩa', oldNames: ['Khóm 14'], area: 3.25, households: 776, population: 3311, leader: 'Huỳnh Văn Thắng', phone: '0859010081', address: 'Tổ 1, khu phố Tân Nghĩa (Trung tâm Văn hóa học tập cộng đồng xã Tân Nghĩa cũ)' },
  { id: '11', newName: 'Khu phố Tân Hòa', oldNames: ['Khóm 15'], area: 6.92, households: 747, population: 3341, leader: 'Mai Văn Tấn Đạt', phone: '0385789354', address: 'Bờ Nam kênh Ông Kho, Tổ 03, khu phố Tân Hòa (trụ sở Khóm 15 cũ)' },
  { id: '12', newName: 'Khu phố Tân Thuận', oldNames: ['Khóm 16'], area: 5.2, households: 656, population: 2751, leader: 'Lê Thị Như Ngọc', phone: '0382859881', address: 'Đường Bờ Đông kênh Tư Tình, Tổ 13, khu phố Tân Thuận (trụ sở Khóm 16 cũ)' }
];

const defaultHeadquarters = [
  { id: 'hq_1', name: 'Trụ sở Đảng ủy', address: 'Phường Mỹ Ngãi', mapUrl: 'https://maps.google.com' },
  { id: 'hq_2', name: 'Trụ sở UBND Phường', address: 'Phường Mỹ Ngãi', mapUrl: 'https://maps.google.com' },
  { id: 'hq_3', name: 'Trụ sở Trung tâm phục vụ hành chính công', address: 'Phường Mỹ Ngãi', mapUrl: 'https://maps.google.com' },
  { id: 'hq_4', name: 'Trụ sở Công an Phường', address: 'Phường Mỹ Ngãi', mapUrl: 'https://maps.google.com' },
  { id: 'hq_5', name: 'Trụ sở Quân sự Phường', address: 'Phường Mỹ Ngãi', mapUrl: 'https://maps.google.com' },
  { id: 'hq_6', name: 'Trụ sở Trung tâm cung ứng dịch vụ công Phường', address: 'Phường Mỹ Ngãi', mapUrl: 'https://maps.google.com' },
  { id: 'hq_7', name: 'Trụ sở MTTQ và các tổ chức CT-XH', address: 'Phường Mỹ Ngãi', mapUrl: 'https://maps.google.com' },
  { id: 'hq_8', name: 'Trụ sở Trạm y tế Phường', address: 'Phường Mỹ Ngãi', mapUrl: 'https://maps.google.com' }
];

const defaultData = {
  neighborhoods: defaultNeighborhoods,
  headquarters: defaultHeadquarters
};

if (!fs.existsSync(dataFilePath)) {
  fs.writeFileSync(dataFilePath, JSON.stringify(defaultData, null, 2));
} else {
  // Migration logic for old data structure
  try {
    let currentData = JSON.parse(fs.readFileSync(dataFilePath, "utf8"));
    let changed = false;

    if (Array.isArray(currentData)) {
      currentData = {
        neighborhoods: currentData,
        headquarters: defaultHeadquarters
      };
      changed = true;
    }

    if (changed) {
      fs.writeFileSync(dataFilePath, JSON.stringify(currentData, null, 2));
    }
  } catch(e) {
    console.error("Data migration failed", e);
  }
}

const ai = process.env.GEMINI_API_KEY ? new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: { headers: { "User-Agent": "aistudio-build" } }
}) : null;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  app.get("/api/data", (req, res) => {
    try {
      const data = JSON.parse(fs.readFileSync(dataFilePath, "utf8"));
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to read data" });
    }
  });

  // Backward compatibility
  app.get("/api/neighborhoods", (req, res) => {
    try {
      const data = JSON.parse(fs.readFileSync(dataFilePath, "utf8"));
      res.json(data.neighborhoods || data);
    } catch (error) {
      res.status(500).json({ error: "Failed to read data" });
    }
  });

  app.put("/api/data", (req, res) => {
    try {
      const newData = req.body;
      fs.writeFileSync(dataFilePath, JSON.stringify(newData, null, 2));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to update data" });
    }
  });


  app.post("/api/chat", async (req, res) => {
    if (!ai) {
      return res.status(500).json({ error: "Gemini API key is not configured" });
    }
    try {
      const { prompt } = req.body;
      const data = fs.readFileSync(dataFilePath, "utf8");
      
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: `Bạn là trợ lý ảo hỗ trợ tra cứu thông tin của Phường Mỹ Ngãi. Dưới đây là dữ liệu về các khu phố (bao gồm tên mới và tên khóm cũ):\n${data}\nHãy trả lời câu hỏi của người dùng ngắn gọn, chính xác dựa trên dữ liệu này.`
        }
      });
      res.json({ reply: response.text });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "AI Assistant unavailable" });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
