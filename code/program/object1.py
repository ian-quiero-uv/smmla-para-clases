from ultralytics import YOLO
from deep_sort_realtime.deepsort_tracker import DeepSort
import cv2

CONFIDENCE_THRESHOLD = 0.6

VIDEO_FRAMES = 30

model = YOLO("code/program/yolov8m.pt")
names = model.names

tracker = DeepSort(max_age=70)

def detection(frame):
    results = model(frame, stream=True)

    for result in results:
        detections = result

    collection = []
    
    for data in detections.boxes.data.tolist():
        if data[5] != 0.0:
            confidence = data[4]

            if float(confidence) < CONFIDENCE_THRESHOLD:
                continue

            xmin, ymin, xmax, ymax = int(data[0]), int(data[1]), int(data[2]), int(data[3])
            class_id = int(data[5])
            collection.append([[xmin,ymin,xmax,ymax], confidence, class_id])

    return collection

def tracking(results, frame, class_id):
    tracks = tracker.update_tracks(results, frame=frame)

    collection = []

    for track in tracks:
        if not track.is_confirmed():
            continue

        track_id = track.track_id
        ltrb = track.to_ltrb()

        xmin, ymin, xmax, ymax = int(ltrb[0]), int(ltrb[1]), int(ltrb[2]), int(ltrb[3])

        xyxy = calcCenter([xmin,ymin,xmax,ymax])

        if not class_id:
            continue

        collection.append([track_id, class_id.pop(0), xyxy[0], xyxy[1]])

    return collection


def calcCenter(data):
    x_center = (data[2] - data[0])//2
    y_center = (data[3]-data[1])//2
    center = [x_center, y_center]
    return center

def main(video):
    video_cap = cv2.VideoCapture(video)

    frame_index = 1

    collection = []

    while video_cap.isOpened():

        ret, frame = video_cap.read()

        if not ret:
            break

        results = detection(frame)

        classes_detected = []
        confidences_detected=[]

        for result in results:
            classes_detected.append(result[2])
            confidences_detected.append(result[1])

        tracks = tracking(results, frame, classes_detected)

        second = frame_index//VIDEO_FRAMES

        for track in tracks:
            track[1] = names[track[1]]
            track.insert(0, frame_index)
            track.insert(1, second)
            track.append(round(confidences_detected.pop(0),2))
            collection.append(track)

        frame_index = frame_index + 1

    video_cap.release()
    cv2.destroyAllWindows()

    return collection
