import httpx, time

t = time.time()
r = httpx.post('http://localhost:8001/api/chat', json={'message': 'Tell me about Anurags skills'}, timeout=120)
d = time.time() - t
data = r.json()

reply = data.get("reply", "")
sources = data.get("sources", [])
confidence = data.get("confidence", 0)

print(f"Time: {d:.1f}s")
print(f"Reply ({len(reply)} chars): {reply[:400]}")
print(f"Sources: {len(sources)}")
print(f"Confidence: {confidence}")
