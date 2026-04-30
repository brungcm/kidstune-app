.PHONY: install dev smoke clean

install:
	npm install --workspaces && npm install --workspaces=false

dev:
	npm run dev

smoke:
	bash scripts/smoke.sh

clean:
	rm -rf frontend/dist functions/lib node_modules
