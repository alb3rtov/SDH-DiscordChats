# Define the name of the virtual environment
VENV_NAME := .venv

# Define the location of the requirements.txt file
REQUIREMENTS_FILE := requirements.txt

# Define name of python modules path
PY_MODULES := py_modules

# Define the destination directory for copied dependencies
DEPS_DEST_DIR := ./defaults/$(PY_MODULES)

# Define file path for fix import audioop issue of discord API
FILE_PATH_IMPORT_FIX := $(DEPS_DEST_DIR)/discord/player.py

# All target
all: setup

# Create a virtual environment
create_venv:
	python3 -m venv $(VENV_NAME)

# Install dependencies from requirements.txt into the virtual environment
install_deps: create_venv
	$(VENV_NAME)/bin/pip install -r $(REQUIREMENTS_FILE)

# Copy dependencies from the virtual environment to the destination directory
copy_deps: install_deps
	mkdir -p $(DEPS_DEST_DIR)
	cp -r $(VENV_NAME)/lib/python*/site-packages/* $(DEPS_DEST_DIR)

# Fix import of python module audioop in discord API 
fix_audioop_import: copy_deps
	sed -i '/import audioop/d' $(FILE_PATH_IMPORT_FIX)
	sed -i '36i try:\n    import audioop\nexcept ImportError:\n    pass' $(FILE_PATH_IMPORT_FIX)

# Create a symlink from ./defaults/py_modules to the root
create_symlink: fix_audioop_import
	mkdir -p $(PY_MODULES)
	ln -s $(DEPS_DEST_DIR)/* $(PY_MODULES)/.

# Main target to simplify the entire process
setup: create_symlink

# Clean up the virtual environment and symlinks
clean:
	rm -rf $(VENV_NAME) $(DEPS_DEST_DIR) $(PY_MODULES)