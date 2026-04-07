import cv2
import numpy as np
import base64

# Use OpenCV's built-in Haar Cascade for face detection
cascade_path = cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
face_classifier = cv2.CascadeClassifier(cascade_path)

def decode_image(base64_string):
    if ',' in base64_string:
        base64_string = base64_string.split(',')[1]
    image_data = base64.b64decode(base64_string)
    nparr = np.frombuffer(image_data, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    return img

def get_face_encoding(base64_image):
    # For LBPH, the "encoding" is just the cropped, normalized grayscale face.
    img = decode_image(base64_image)
    if img is None:
         return {"success": False, "message": "Failed to decode image."}
         
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Detect face
    faces = face_classifier.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(60,60))
    if len(faces) == 0:
        return {"success": False, "message": "No face detected in the frame. Please try again."}
    if len(faces) > 1:
        return {"success": False, "message": "Multiple faces detected. Please ensure only one person is in the frame."}
        
    x, y, w, h = faces[0]
    cropped_face = gray[y:y+h, x:x+w]
    
    # Resize to a standard size (e.g., 100x100) for consistency in LBPH training
    resized_face = cv2.resize(cropped_face, (100, 100))
    
    # Return as list for JSON serialization into SQLite text column
    return {"success": True, "encoding": resized_face.tolist()}

def match_face(base64_image, known_encodings):
    """
    known_encodings: dict of {student_id: 2D list of grayscale pixels}
    """
    img = decode_image(base64_image)
    if img is None:
         return {"success": False, "message": "Failed to decode image."}
         
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    faces = face_classifier.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(60,60))
    if len(faces) == 0:
        return {"success": False, "message": "No face detected in the frame."}
    if len(faces) > 1:
        return {"success": False, "message": "Multiple faces detected (Fraud)."}
        
    x, y, w, h = faces[0]
    cropped_face = gray[y:y+h, x:x+w]
    resized_face = cv2.resize(cropped_face, (100, 100))

    if not known_encodings:
        return {"success": False, "message": "No registered encodings found."}

    # Prepare data for OpenCV LBPH
    training_data = []
    labels = []
    
    for student_id, pixels_list in known_encodings.items():
        face_array = np.array(pixels_list, dtype=np.uint8)
        training_data.append(face_array)
        labels.append(int(student_id))
        
    # We must have opencv-contrib-python installed for lbph face recognizer
    try:
        recognizer = cv2.face.LBPHFaceRecognizer_create()
    except AttributeError:
        return {"success": False, "message": "Server error: opencv-contrib-python not installed"}
        
    recognizer.train(training_data, np.array(labels))
    
    # Predict
    label, confidence = recognizer.predict(resized_face)
    
    # For LBPH, confidence is distance. Lower means a better match. 
    # Usually < 75 is a good match, but threshold can vary.
    if confidence < 80:
        return {"success": True, "student_id": label}
    else:
        return {"success": False, "message": "Face not recognized. Dist too high."}
