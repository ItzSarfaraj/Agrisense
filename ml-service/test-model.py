import joblib

model = joblib.load("models/crop_model.pkl")
encoder = joblib.load("models/label_encoder.pkl")

sample = [[
    90,
    42,
    43,
    6.5,
    82,
    202,
    20.8
]]

prediction = model.predict(sample)

crop = encoder.inverse_transform(prediction)

print("Recommended Crop:", crop[0])