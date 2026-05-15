#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
LinkedIn / Instagram / YouTube Content Generator for Alisn Art
Generates "AI-optimized" professional content based on project data.
"""

import os
from datetime import datetime, timedelta

OUTPUT_DIR = r'D:\艾里森官网\social_media_content'
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Project Data Template
PROJECT_DATA = {
    "name": "Dragon Cloud Light Sculpture",
    "type": "Landmark Sculpture / Cultural Tourism",
    "size": "20m Height, 12 Tons",
    "material": "304 Stainless Steel + 50k LEDs",
    "location": "Guangzhou, China",
    "key_achievement": "Increased night-time foot traffic by 40%",
    "process_steps": ["3D Modeling", "CNC Steel Skeleton", "LED Integration", "On-site Assembly"]
}

def generate_linkedin_post():
    return f"""
══════════════════════════════════════════════
🔗 LinkedIn Post (B2B Professional Tone)
══════════════════════════════════════════════
Headline: How We Built a 20m Interactive Light Sculpture for Cultural Tourism 🏗️✨

Body:
Large-scale public art isn't just about aesthetics—it's about engineering, durability, and creating an experience.

Our latest project, the "Dragon Cloud Light Sculpture," is a 20-meter tall landmark installation for a major cultural tourism park in Guangzhou.

🛠️ Project Specs:
• Height: 20m | Weight: 12 Tons
• Material: 304 Stainless Steel + 50,000 RGB LEDs
• Structure: Internal Q345B Steel Skeleton (Wind Load Level 12)
• Lighting: DMX512 Programmable Light Show

At Alisn Art, we handle the full lifecycle:
✅ 3D Modeling & Simulation
✅ Precision Fabrication in China
✅ Global Shipping & On-site Assembly

We don't just make sculptures; we create landmarks that drive foot traffic and night-time economy. (This project increased visitor traffic by 40%!)

Looking for a reliable manufacturer for your next landmark project?
Let's talk.

#PublicArt #ArtInstallations #CulturalTourism #UrbanDesign #AlisnArt #LandmarkSculpture #Manufacturing #LightingDesign
"""

def generate_instagram_post():
    return f"""
══════════════════════════════════════════════
📸 Instagram Post (Visual + Professional Description)
══════════════════════════════════════════════
Caption:
The Dragon Cloud rises. ☁️🐉

A 20-meter interactive light sculpture designed for cultural tourism. 
Crafted from 304 stainless steel and integrated with 50,000 LED pixels to create a dynamic night-time experience.

📍 Guangzhou, China
🏗️ Fabricated by Alisn Art
💡 Lighting: DMX512 Programmable

From 3D modeling to on-site assembly, we bring large-scale visions to life.

#PublicArt #InteractiveArt #LightSculpture #UrbanArt #CulturalTourism #NightEconomy #AlisnArt #ArtInstallation #Engineering #Design

Image Suggestion:
- Image 1: Night shot of the sculpture glowing.
- Image 2: Construction/Fabrication process (steel skeleton).
- Image 3: Drone shot showing scale.
"""

def generate_youtube_script():
    return f"""
══════════════════════════════════════════════
🎥 YouTube Video Script (Project Showcase)
══════════════════════════════════════════════
Title:
Fabricating a 20m Light Sculpture: From Steel to Masterpiece | Alisn Art

Description:
Watch the full process of creating the "Dragon Cloud," a 20-meter interactive landmark sculpture.
We cover the 3D design, steel fabrication, LED installation, and final assembly.

📍 Project Specs:
• Height: 20m
• Material: Stainless Steel
• Lighting: 50,000 LEDs

Alisn Art is a leading manufacturer of large-scale public art and cultural tourism installations in China.
Website: https://alisnart.com

#PublicArt #Fabrication #CulturalTourism #LightSculpture #AlisnArt

Video Structure:
0:00 - Drone Shot of Finished Sculpture
0:15 - 3D Modeling & Design Phase
0:45 - CNC Steel Skeleton Fabrication
1:30 - Stainless Steel Cladding & Polishing
2:15 - LED Integration & Programming
3:00 - Shipping & On-site Assembly
3:45 - Final Night-Time Light Show
"""

# Generate and Save
with open(os.path.join(OUTPUT_DIR, 'social_media_draft.txt'), 'w', encoding='utf-8') as f:
    f.write(generate_linkedin_post())
    f.write("\n\n")
    f.write(generate_instagram_post())
    f.write("\n\n")
    f.write(generate_youtube_script())

print("✅ Social media content generated for LinkedIn, Instagram, and YouTube.")
