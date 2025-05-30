# === Backend (Flask) with Frame Feature ===
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import qrcode
import uuid
from PIL import Image, ImageDraw, ImageFilter
import io

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "../static/uploads"
QR_FOLDER = "../static/qr_code"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(QR_FOLDER, exist_ok=True)

def create_gradient_frame(qr_img, frame_type):
    """Create different frame styles for QR code"""
    qr_size = qr_img.size
    frame_width = 60
    total_size = (qr_size[0] + frame_width * 2, qr_size[1] + frame_width * 2)
    
    # Create base image with frame
    framed_img = Image.new('RGB', total_size, 'white')
    
    if frame_type == 'gradient_purple':
        # Purple gradient frame
        for i in range(frame_width):
            color_intensity = int(255 * (1 - i / frame_width))
            color = (138 - color_intensity//3, 43 - color_intensity//6, 226 - color_intensity//4)
            draw = ImageDraw.Draw(framed_img)
            draw.rectangle([i, i, total_size[0]-i-1, total_size[1]-i-1], outline=color, width=1)
    
    elif frame_type == 'gradient_rainbow':
        # Rainbow gradient frame
        import colorsys
        for i in range(frame_width):
            hue = (i / frame_width) * 360
            rgb = colorsys.hsv_to_rgb(hue/360, 1, 1)
            color = tuple(int(255 * c) for c in rgb)
            draw = ImageDraw.Draw(framed_img)
            draw.rectangle([i, i, total_size[0]-i-1, total_size[1]-i-1], outline=color, width=1)
    
    elif frame_type == 'neon_glow':
        # Neon glow effect
        # Create glow base
        glow_img = Image.new('RGB', total_size, (0, 0, 0))
        draw = ImageDraw.Draw(glow_img)
        
        # Multiple glow layers
        for i in range(0, frame_width, 5):
            alpha = 255 - (i * 4)
            if alpha < 0: alpha = 0
            glow_color = (0, 255, 255, alpha)  # Cyan glow
            draw.rectangle([i, i, total_size[0]-i-1, total_size[1]-i-1], outline=(0, 255, 255), width=3)
        
        # Apply blur for glow effect
        glow_img = glow_img.filter(ImageFilter.GaussianBlur(radius=3))
        framed_img = Image.blend(framed_img, glow_img, 0.7)
    
    elif frame_type == 'elegant_border':
        # Elegant border with patterns
        draw = ImageDraw.Draw(framed_img)
        # Outer border
        draw.rectangle([0, 0, total_size[0]-1, total_size[1]-1], outline=(40, 40, 40), width=8)
        # Inner border
        draw.rectangle([15, 15, total_size[0]-16, total_size[1]-16], outline=(200, 200, 200), width=3)
        # Decorative corners
        corner_size = 20
        corners = [
            (10, 10), (total_size[0]-30, 10),
            (10, total_size[1]-30), (total_size[0]-30, total_size[1]-30)
        ]
        for corner in corners:
            draw.rectangle([corner[0], corner[1], corner[0]+corner_size, corner[1]+corner_size], 
                         fill=(100, 100, 100))
    
    elif frame_type == 'modern_shadow':
        # Modern shadow effect
        # Create shadow
        shadow_img = Image.new('RGBA', (total_size[0] + 20, total_size[1] + 20), (0, 0, 0, 0))
        shadow_draw = ImageDraw.Draw(shadow_img)
        shadow_draw.rectangle([20, 20, total_size[0], total_size[1]], fill=(0, 0, 0, 80))
        shadow_img = shadow_img.filter(ImageFilter.GaussianBlur(radius=10))
        
        # Create main frame
        main_frame = Image.new('RGB', (total_size[0] + 20, total_size[1] + 20), (255, 255, 255))
        main_frame.paste(shadow_img, (0, 0), shadow_img)
        
        # Add gradient border
        draw = ImageDraw.Draw(main_frame)
        for i in range(5):
            color_val = 200 - i * 20
            draw.rectangle([i, i, total_size[0]-i, total_size[1]-i], outline=(color_val, color_val, color_val), width=1)
        
        # Paste QR code
        main_frame.paste(qr_img, (frame_width, frame_width))
        return main_frame
    
    # Default: paste QR code onto frame
    framed_img.paste(qr_img, (frame_width, frame_width))
    return framed_img

@app.route("/generate", methods=["POST"])
def generate_qr():
    data = request.form.get("data")
    image = request.files.get("image")
    frame_type = request.form.get("frame", "none")  # Get frame type
    
    if image and image.filename:
        ext = os.path.splitext(image.filename)[1]
        img_filename = f"{uuid.uuid4().hex}{ext}"
        img_path = os.path.join(UPLOAD_FOLDER, img_filename)
        image.save(img_path)

        img_url = f"http://localhost:5000/uploads/{img_filename}"
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_H,
            box_size=10,
            border=4,
        )
        qr.add_data(img_url)
        qr.make(fit=True)
        qr_img = qr.make_image(fill_color="black", back_color="white").convert('RGB')
        
    elif data:
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_H,
            box_size=10,
            border=4,
        )
        qr.add_data(data)
        qr.make(fit=True)
        qr_img = qr.make_image(fill_color="black", back_color="white").convert('RGB')
    else:
        return jsonify({"error": "No input provided"}), 400

    # Apply frame if selected
    if frame_type != "none":
        try:
            qr_img = create_gradient_frame(qr_img, frame_type)
        except Exception as e:
            print(f"Frame error: {e}")
            # Continue with original QR if frame fails

    qr_filename = f"{uuid.uuid4().hex}.png"
    qr_path = os.path.join(QR_FOLDER, qr_filename)
    qr_img.save(qr_path, format='PNG', quality=95)

    qr_url = f"http://localhost:5000/qr/{qr_filename}"
    return jsonify({"qr_url": qr_url, "filename": qr_filename})

@app.route("/uploads/<filename>")
def serve_upload(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

@app.route("/qr/<filename>")
def serve_qr(filename):
    return send_from_directory(QR_FOLDER, filename)

if __name__ == "__main__":
    print("🚀 Server Running on port 5000")
    print("🎨 QR Frame Feature Available!")
    app.run(debug=True)