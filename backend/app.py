from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
from skimage import io, restoration
from skimage.metrics import peak_signal_noise_ratio
import base64

app = Flask(__name__)
CORS(app)

def base64_to_cv2(base64_string):
    img_data = base64.b64decode(base64_string)
    nparr = np.frombuffer(img_data, np.uint8)
    return cv2.imdecode(nparr, cv2.IMREAD_COLOR)

def cv2_to_base64(image):
    _, buffer = cv2.imencode('.png', image)
    return f"data:image/png;base64,{base64.b64encode(buffer).decode('utf-8')}"

@app.route('/api/denoise', methods=['POST'])
def denoise_image():
    data = request.json
    image_data = data['image']
    method = data['method']
    strength = data['strength'] / 100  # Normalize to 0-1

    img = base64_to_cv2(image_data)

    if method == 'nlm':
        denoised = cv2.fastNlMeansDenoisingColored(img, None, strength * 10, strength * 10, 7, 21)
    elif method == 'wavelet':
        denoised = restoration.denoise_wavelet(img, multichannel=True, convert2ycbcr=True, method='BayesShrink', mode='soft', rescale_sigma=True)
        denoised = (denoised * 255).astype(np.uint8)
    elif method == 'tv':
        denoised = restoration.denoise_tv_chambolle(img, weight=strength, multichannel=True)
        denoised = (denoised * 255).astype(np.uint8)
    else:
        return jsonify({'error': 'Invalid denoising method'}), 400

    psnr = peak_signal_noise_ratio(img, denoised)
    
    return jsonify({
        'processed_image': cv2_to_base64(denoised),
        'psnr': psnr
    })

@app.route('/api/enhance', methods=['POST'])
def enhance_image():
    data = request.json
    image_data = data['image']
    brightness = data['brightness']
    contrast = data['contrast']
    saturation = data['saturation']
    sharpness = data['sharpness']

    img = base64_to_cv2(image_data)

    # Adjust brightness and contrast
    alpha = 1 + contrast / 100
    beta = brightness
    img = cv2.convertScaleAbs(img, alpha=alpha, beta=beta)

    # Adjust saturation
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    hsv[:,:,1] = np.clip(hsv[:,:,1] * (1 + saturation / 100), 0, 255)
    img = cv2.cvtColor(hsv, cv2.COLOR_HSV2BGR)

    # Apply sharpening
    if sharpness > 0:
        kernel = np.array([[-1,-1,-1], [-1,9,-1], [-1,-1,-1]]) * (sharpness / 100)
        img = cv2.filter2D(img, -1, kernel)

    psnr = peak_signal_noise_ratio(base64_to_cv2(image_data), img)

    return jsonify({
        'processed_image': cv2_to_base64(img),
        'psnr': psnr
    })

if __name__ == '__main__':
    app.run(debug=True)