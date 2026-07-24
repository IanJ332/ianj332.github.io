import os
import re
import json

def load_v2_data():
    v2_data = {}
    
    # Read portfolio.js
    with open("src/data/portfolio.js", "r", encoding="utf-8") as f:
        port_text = f.read()
    
    # Read migrationData.js
    with open("src/data/migrationData.js", "r", encoding="utf-8") as f:
        mig_text = f.read()

    v2_data["portfolio_js"] = port_text
    v2_data["migration_js"] = mig_text
    return v2_data

def load_v3_site_text():
    all_text = []
    for root, dirs, files in os.walk("v3.0-site"):
        for fname in files:
            if fname.endswith((".html", ".js", ".json")):
                fpath = os.path.join(root, fname)
                try:
                    with open(fpath, "r", encoding="utf-8") as f:
                        all_text.append(f.read())
                except:
                    pass
    return " ".join(all_text)

def main():
    v2 = load_v2_data()
    v3_text = load_v3_site_text()

    keywords = {
        "Name / Greeting": ["Ian Jiang", "Jisheng Jiang", "Full-Stack Software Engineer"],
        "Education": [
            "University of Illinois Urbana-Champaign", "UIUC", "Master of Computer Science", 
            "San José State University", "SJSU", "B.S. in Computer Science", "Dean's Scholar", "Cum Laude"
        ],
        "Work Experience": [
            "UIUC AI Alignment Lab", "Multi-Agent Debate", "3D confidence scoring",
            "VideoTutor.ai", "LangChain routing classifier", "Databricks + FAISS",
            "CollegeBot.ai", "Milvus-backed stateful memory engine",
            "TRIPALINK", "AWS EKS", "Spring Boot", "GraphQL",
            "The Rabbit Haven", "React portal", "Pessimistic Locking"
        ],
        "Featured Projects": [
            "Antigravity Awesome Skills", "Hazard-Tagging",
            "Multimodal Sentiment Analysis System", "Lite-MSA", "Int8 quantization", "HuBERT",
            "BakeWise", "backward-scheduling algorithm",
            "Sign Language Recognition", "MobileNetV2", "Optuna",
            "Helper Bob",
            "MAD: Majority Error Debate",
            "Liquidity: Bank Simulation", "Supabase"
        ],
        "Contact & Links": [
            "jiangjs03@gmail.com",
            "github.com/IanJ332",
            "linkedin.com/in/jisheng-jiang",
            "drive.google.com/file/d/1LWvYgkYbMujArbqPk4KPg-zBK91V5-uk"
        ]
    }

    print("==================================================")
    print("        v2.0 vs v3.0 Content Audit Report         ")
    print("==================================================")

    for category, terms in keywords.items():
        print(f"\n--- {category} ---")
        for term in terms:
            in_v3 = term.lower() in v3_text.lower()
            status = "✓ FOUND in v3.0" if in_v3 else "✗ MISSING in v3.0 (Needs Migration)"
            print(f" [{ 'PASS' if in_v3 else 'NEED' }] {term}: {status}")

if __name__ == "__main__":
    main()
