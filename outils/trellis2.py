"""Génère un GLB avec TRELLIS.2 (Microsoft, licence MIT) sur Hugging Face.
Usage : python trellis2.py <image.png> <sortie.glb> [graine] [resolution]
Jeton facultatif : variable HF_TOKEN (quota de calcul gratuit plus large)."""
import sys, os, shutil, time
from gradio_client import Client, handle_file
img, dst = sys.argv[1], sys.argv[2]
seed = float(sys.argv[3]) if len(sys.argv) > 3 else 0
res = sys.argv[4] if len(sys.argv) > 4 else "1024"
c = Client("microsoft/TRELLIS.2", token=os.environ.get("HF_TOKEN") or None)
t = time.time()
c.predict(api_name="/start_session")
pre = c.predict(handle_file(img), api_name="/preprocess_image")
print("pretraitement", pre, round(time.time()-t))
shutil.copy(pre if isinstance(pre, str) else pre["path"], dst.replace(".glb", "_entree_pretraitee.png"))
c.predict(handle_file(pre if isinstance(pre, str) else pre["path"]), seed, res, api_name="/image_to_3d")
print("generation", round(time.time()-t))
glb, dl = c.predict(300000, 2048, api_name="/extract_glb")
shutil.copy(dl or glb, dst)
print("OK", dst, os.path.getsize(dst), "octets", round(time.time()-t), "s")
