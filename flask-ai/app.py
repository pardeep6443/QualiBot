from flask import Flask, request, jsonify
import cv2
import os

app = Flask(__name__)

# Ensure the 'uploads' directory exists
if not os.path.exists('uploads'):
    os.makedirs('uploads')

@app.route('/process-image', methods=['POST'])
def process_image():
    try:
        # Check if the 'image' file is present in the request
        if 'image' not in request.files:
            return jsonify({"error": "No file part in the request"}), 400

        # Get the file from the request
        file = request.files['image']

        # Check if the file has a valid filename
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400

        # Save the file temporarily for processing
        image_path = os.path.join("uploads", file.filename)
        file.save(image_path)

        # Log the image path for debugging
        print(f"Received image path: {image_path}")

        # Check if the image file exists
        if not os.path.exists(image_path):
            return jsonify({"error": "Image not found"}), 400

        # Try to read the image using OpenCV
        image = cv2.imread(image_path)
        if image is None:
            return jsonify({"error": "Error reading image"}), 500

        # Process the image (example: convert to grayscale)
        gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

        # Log success
        print("Image processed successfully")

        # Delete the image file after processing
        os.remove(image_path)

        # Return success message
        return jsonify({"message": "Image processed successfully"})



        
        # Example detailed report after image processing
        detection_report = {
            "status": "Success",
            "message": "Image processed successfully.",
            "defects": [
                {"type": "Scratch", "severity": "High", "location": "Top-Left"},
                {"type": "Crack", "severity": "Medium", "location": "Center"},
                {"type": "Discoloration", "severity": "Low", "location": "Bottom-Right"}
            ],
            "total_defects": 3,
            "overall_quality": "Below standard"
        }

        return jsonify(detection_report)


    except Exception as e:
        # Log the error for debugging
        print(f"Error during image processing: {str(e)}")
        return jsonify({"error": f"Error processing image: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5001, debug=True)