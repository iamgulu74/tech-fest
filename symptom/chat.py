import random
import json
import torch
import math
import geocoder
import requests
import os
from dotenv import load_dotenv

load_dotenv() # Load key if provided in .env

from model_chat import RNNModel  # Import the RNN model
from nltk_utils import bag_of_words, tokenize

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

with open('intents.json', 'r') as json_data:
    intents = json.load(json_data)

FILE = "data_rnn.pth" 
data = torch.load(FILE)

input_size = data["input_size"]
hidden_size = data["hidden_size"]
output_size = data["output_size"]
num_layers = data["num_layers"]  # Add the number of layers used in your RNN model
all_words = data['all_words']
tags = data['tags']
model_state = data["model_state"]

model = RNNModel(input_size, hidden_size, output_size, num_layers).to(device)
model.load_state_dict(model_state)
model.eval()

bot_name = "Sam"

def get_response(msg):
    sentence = tokenize(msg)
    if ("name" in sentence) or ("this is" in msg.lower()) :
        for wor in sentence:
            if (wor.lower() != "my") and (wor.lower() != "is") and (wor.lower() != "name") and (wor.lower() != "i") and (wor.lower() != "am") and (wor.lower() != "this"):
                user_name = wor.capitalize()
                res = "Hi " + user_name + " please say your age."
                return ["name", res]
    if ("age" in sentence) or ("I" in sentence and "am" in sentence) or ("I'm" in sentence):
        for wor in sentence:
            if wor.isnumeric():
                user_age = wor
                res = "What is your gender?"
                return ["age", res]
    if ("male" in sentence) or ("female" in sentence) or ("Male" in sentence) or ("Female" in sentence):
        for wor in sentence:
            if (wor.lower() == "male") or (wor.lower() == "female"):
                user_gender = wor.lower()
                res = "Tell the symptoms you have to know about potential conditions."
                return ["gender", res]
    if ("yes" in sentence) or (("medical" in sentence) and "center" in sentence) or ("hospital" in sentence) or ("hospitals" in sentence) :
        li = centres()
        return li

    X = bag_of_words(sentence, all_words)
    X = torch.tensor(X).unsqueeze(0).to(device)

    output = model(X)
    _, predicted = torch.max(output, dim=1)

    #topk_values, topk_indices = torch.topk(output, k=3, dim=1)

    tag = tags[predicted.item()]
    #tag = [tags[i] for i in topk_indices[0]]

    probs = torch.softmax(output, dim=1)
    prob = probs[0][predicted.item()]

    """
    if prob.item() > 0.5:
        l = []
        for intent in intents['intents']:
            for a in tag:
                if intent["tag"] == a:
                    l.append([intent['tag'], intent['responses']])
        return l
    """
    
    if prob.item() > 0.4:
        for intent in intents['intents']:
            if intent["tag"] == tag:
                if tag in ["greeting", "goodbye","work","who","Thanks","joke", "name", "age", "gender"]:
                    return [intent['tag'], intent['responses']]
                return [intent['tag'], intent['responses'], intent['Precaution']]

    return ["not_understand","I do not understand. Can you please rephrase the sentence?"]

def centres():
    # Radius in KM for real-time OSM lookup
    RADIUS_KM = 30 
    
    try:
        # Get dynamic user location
        location = geocoder.ip('me')
        latlng = location.latlng if location.latlng else [13.0827, 80.2707] # Default to Chennai
        lat, lng = latlng
        
        # Free OpenStreetMap Overpass Query
        overpass_url = "http://overpass-api.de/api/interpreter"
        overpass_query = f"""
        [out:json];
        (
          node(around:{RADIUS_KM * 1000},{lat},{lng})[amenity=hospital];
          way(around:{RADIUS_KM * 1000},{lat},{lng})[amenity=hospital];
          relation(around:{RADIUS_KM * 1000},{lat},{lng})[amenity=hospital];
        );
        out center;
        """
        
        resp = requests.get(overpass_url, params={'data': overpass_query}, timeout=10)
        osm_data = resp.json()
        
        results = ["center"]
        
        def haversine(lat1, lon1, lat2, lon2):
            R = 6371.0
            lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])
            dlon, dlat = lon2 - lon1, lat2 - lat1
            a = math.sin(dlat / 2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2)**2
            c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
            return R * c

        found_hospitals = []
        for element in osm_data.get('elements', []):
            # Way/Relation centers are in 'center', nodes are in 'lat'/'lon'
            elem_lat = element.get('lat') or element.get('center', {}).get('lat')
            elem_lng = element.get('lon') or element.get('center', {}).get('lng')
            
            if not elem_lat: continue
            
            name = element.get('tags', {}).get('name', 'Community Health Center')
            addr = element.get('tags', {}).get('addr:full') or element.get('tags', {}).get('addr:street', 'Local Area')
            
            dist = haversine(lat, lng, elem_lat, elem_lng)
            found_hospitals.append((name, dist, addr))
            
        found_hospitals.sort(key=lambda x: x[1])
        
        for name, dist, addr in found_hospitals[:10]:
            results.append([name, (str(round(dist, 2))+'km'), addr])
            
        if len(results) <= 1:
            with open("medical_centers.json", "r") as f:
                med_json = json.load(f)["intents"]
                for c in med_json[:5]:
                    results.append([c["tag"], "Nearby", c.get("Address", "Local Address")])
                    
        return results
        
    except Exception as e:
        print(f"Integration Error: {e}")
        return ["center", "I encountered a problem fetching real-time hospital data. Please check local emergency services."]


if __name__ == "__main__":
    print("Let's chat! (type 'quit' to exit)")
    while True:
        sentence = input("You: ")
        if sentence == "quit":
            break

        resp = get_response(sentence)
        print("Bot:", resp)
