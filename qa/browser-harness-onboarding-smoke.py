new_tab("http://127.0.0.1:3000/")
wait_for_load()
info = page_info()
assert "Official AI" in info["title"], info
assert "Show up on video" in js("document.body.innerText")

new_tab("http://127.0.0.1:3000/signup")
wait_for_load()
body = js("document.body.innerText")
assert "Start with your profession" in body
assert "I'm a lawyer" in body

new_tab("http://127.0.0.1:3000/waitlist")
wait_for_load()
assert "focused on lawyers and real estate first" in js("document.body.innerText")

print("browser-harness onboarding route smoke ok")
