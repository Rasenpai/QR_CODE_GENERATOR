# 🚀 SnapQR - Dynamic QR Code Generator 

![SnapQR Banner](https://img.shields.io/badge/SnapQR-Dynamic%20QR%20Generator-purple?style=for-the-badge&logo=qrcode)

**SnapQR** adalah aplikasi web modern yang memungkinkan pengguna untuk **generate QR Code dinamis** dari input teks, URL, maupun gambar dengan berbagai style frame yang menarik! 🎨✨

## 🌟 Fitur Unggulan

- 🔤 **Text/URL to QR**: Generate QR Code dari teks atau URL dengan validasi keamanan
- 🖼️ **Image to QR**: Upload gambar dan otomatis generate QR Code
- 🎨 **Custom Frame Styles**: 6+ pilihan frame cantik (Gradient, Neon, Elegant, dll.)
- 🌐 **Multi-Language**: Dukungan Bahasa Indonesia dan English
- 🛡️ **Safe Mode**: Proteksi dari link berbahaya dengan URL checker
- 📱 **Responsive Design**: Interface yang indah di semua device
- 📥 **Auto Download**: Download QR dengan nama file unik
- ⚡ **Real-time Generation**: Generate QR secara instan

## 🛠️ Tech Stack

### 🔙 Backend
![Flask](https://img.shields.io/badge/flask-%23000.svg?style=for-the-badge&logo=flask&logoColor=white)
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)

### 🔜 Frontend  
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
## 📁 Struktur Project

```
QR_WEB_GENERATOR/
├── 📂 Backend/
│   ├── 🐍 app.py                 # Flask API Server
│   ├── 📦 requirements.txt       # Python Dependencies
│   └── 🔧 myvenv/               # Virtual Environment
├── 📂 Frontend/
│   ├── 📂 public/               # Static Assets
│   ├── 📂 src/                  # React Source Code
│   │   ├── ⚛️ App.jsx           # Main Component
│   │   └── 🎨 index.css         # Global Styles
│   ├── 📄 index.html
│   ├── 📦 package.json          # Node Dependencies
│   └── ⚙️ vite.config.js        # Vite Configuration
├── 📂 static/
│   ├── 📱 qr_codes/             # Generated QR Storage
│   ├── 📤 uploads/              # Uploaded Images Storage
│   └── 🖼️ assets/              # Static Assets
└── 📖 README.md
```

## 🚀 Quick Start

### 📋 Prerequisites

- 🐍 **Python 3.8+**
- 📦 **Node.js 16+** 
- 💻 **npm/yarn**

### 🔧 Backend Setup

1. **Navigate to Backend directory**
   ```bash
   cd Backend
   ```

2. **Create Virtual Environment** (Recommended)
   ```bash
   python -m venv myvenv
   
   # Windows
   myvenv\Scripts\activate
   
   # macOS/Linux  
   source myvenv/bin/activate
   ```

3. **Install Python Dependencies**
   ```bash
   pip install flask flask_cors qrcode Pillow
   ```
   
   Or use requirements.txt:
   ```bash
   pip install -r requirements.txt
   ```

4. **Run Flask Server**
   ```bash
   python app.py
   ```
   
   🌐 Backend akan berjalan di: `http://localhost:5000`

### ⚛️ Frontend Setup

1. **Navigate to Frontend directory**
   ```bash
   cd Frontend
   ```

2. **Install Node Dependencies**
   ```bash
   npm install
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```
   
   🌐 Frontend akan berjalan di: `http://localhost:5173`

## 📦 Dependencies

### 🐍 Python (Backend)
| Package | Version | Description |
|---------|---------|-------------|
| `flask` | `^2.3.0` | Web framework untuk API |
| `flask_cors` | `^4.0.0` | Cross-Origin Resource Sharing |
| `qrcode` | `^7.4.2` | QR Code generator library |
| `Pillow` | `^10.0.0` | Image processing library |

### ⚛️ React (Frontend)
| Package | Version | Description |
|---------|---------|-------------|
| `react` | `^18.2.0` | UI Library |
| `react-dom` | `^18.2.0` | React DOM renderer |
| `lucide-react` | `^0.263.1` | Beautiful icons |
| `@vitejs/plugin-react` | `^4.0.3` | Vite React plugin |
| `tailwindcss` | `^3.3.0` | Utility-first CSS framework |

## 🎯 API Endpoints

### `POST /generate`
Generate QR Code dari text atau image

**Request:**
```javascript
// Form Data
{
  "data": "text/url",           // Optional: text input
  "image": File,                // Optional: image file
  "frame": "gradient_purple"    // Frame style
}
```

**Response:**
```json
{
  "qr_url": "http://localhost:5000/static/qr_codes/qr_20241201_123456.png",
  "filename": "qr_20241201_123456.png"
}
```

### `GET /static/qr_codes/<filename>`
Download generated QR code

## 🎨 Frame Styles Available

- 🔳 **None** - Tanpa frame
- 🟣 **Purple Gradient** - Gradient ungu elegan  
- 🌈 **Rainbow Gradient** - Gradient pelangi ceria
- ⚡ **Neon Glow** - Efek neon yang menawan
- 🖼️ **Elegant Border** - Border klasik dan elegan
- 🌑 **Modern Shadow** - Shadow modern dan stylish

## 🔒 Security Features

- 🛡️ **Safe Mode**: Proteksi otomatis dari link berbahaya
- 🔍 **URL Validation**: Pengecekan keamanan URL secara real-time
- 📝 **Input Sanitization**: Validasi input untuk keamanan
- 🚫 **Blacklist Domains**: Filter domain berbahaya

## 🌐 Multi-Language Support

- 🇮🇩 **Bahasa Indonesia**
- 🇬🇧 **English**

## 📱 Responsive Design

Aplikasi ini 100% responsive dan optimized untuk:
- 📱 Mobile (320px+)
- 📟 Tablet (768px+) 
- 💻 Desktop (1024px+)
- 🖥️ Large Desktop (1440px+)

## 🚀02 Production Deploy

### 🔧 Backend
```bash
# Using Gunicorn
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### ⚛️ Frontend
```bash
# Build for production
npm run build

# Serve with nginx/apache
npm run preview
```

## 🤝 Contributing

Kontribusi sangat welcome! 🎉

1. 🍴 Fork repository ini
2. 🌿 Buat branch baru (`git checkout -b feature/amazing-feature`)
3. 💾 Commit changes (`git commit -m 'Add amazing feature'`)
4. 📤 Push ke branch (`git push origin feature/amazing-feature`)
5. 🔃 Buat Pull Request

## 📄 License

Distributed under MIT License. See `LICENSE` for more information.

## 👨‍💻 Author

**Rasena** - [@hyrasena](https://www.tiktok.com/@hyrasena) - [@rrssnaaa](https://www.instagram.com/rrssnaaa/)

## 🙏 Acknowledgments

- 🎨 [Lucide Icons](https://lucide.dev/) untuk icon yang indah
- 🎯 [TailwindCSS](https://tailwindcss.com/) untuk styling yang amazing
- ⚡ [Vite](https://vitejs.dev/) untuk development experience yang cepat
- 🐍 [Flask](https://flask.palletsprojects.com/) untuk backend yang simple

---

<div align="center">

**⭐ Jangan lupa star repository ini jika bermanfaat! ⭐**

![Made with Love](https://img.shields.io/badge/Made%20with-❤️-red?style=for-the-badge)
![Indonesia](https://img.shields.io/badge/Made%20in-🇮🇩%20Indonesia-red?style=for-the-badge)

</div># QrCodeWeb
# QrWebGenerator
