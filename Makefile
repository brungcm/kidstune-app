.PHONY: install dev smoke clean deploy

install:
	npm install --workspaces && npm install --workspaces=false

dev:
	npm run dev

smoke:
	bash scripts/smoke.sh

clean:
	rm -rf frontend/dist functions/lib node_modules

deploy:
	@echo "==> Building frontend..."
	cd frontend && npm install && npm run build
	@echo "==> Building functions..."
	cd functions && npm install && npm run build
	@echo "==> Deploying to Firebase (hosting + functions)..."
	firebase deploy --only hosting,functions --project kidstune-dev --non-interactive --force || \
	  (echo "==> Functions deploy failed (likely Spark plan). Falling back to hosting-only..." && \
	   firebase deploy --only hosting --project kidstune-dev --non-interactive --force)
	@echo "==> Deploy complete!"
