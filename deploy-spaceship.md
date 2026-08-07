# Spaceship shared hosting — deploy checklist

## Subir para o Application root

- [ ] `passenger_wsgi.py`
- [ ] `aggregator.py`
- [ ] `requirements.txt`
- [ ] Páginas HTML da raiz (`index.html`, `about.html`, `blog.html`, `contact.html`, `portfolio.html`, `thank-you.html`, …)
- [ ] `css/`, `js/`, `assets/`, `blog/`, `proj/`
- [ ] `proj/iris/` completo, incluindo `model.pkl`, `app.py`, `templates/`, `static/`

## Não subir (alinhado com `.gitignore`)

- [ ] `.venv/`, `venv/`, `env/`
- [ ] `node_modules/`
- [ ] `.env` / ficheiros de secrets
- [ ] `__pycache__/`, `*.pyc`
- [ ] `.git/` (opcional; sobe só se usares Git no servidor)
- [ ] `.DS_Store`, logs, `tmp/`
- [ ] `build/`, `dist/`, `coverage/`

## No cPanel (Setup Python App)

1. Criar app Python 3.10+ apontada a `ndilokelwa.tech`
2. Startup file: `passenger_wsgi.py`
3. Entry point: `application`
4. Upload dos ficheiros para o Application root
5. **Run Pip Install** → `requirements.txt`
6. **Restart** da aplicação
7. Testar: `/`, `/portfolio.html`, `/proj/iris/`, `/proj/egrab/egrab.html`
