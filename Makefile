# Define the name of the virtual environment
VENV_NAME := venv

# Define the location of the requirements.txt file
REQUIREMENTS_FILE := requirements.txt

# Define the destination directory for copied dependencies
DEPS_DEST_DIR := ./defaults/py_modules

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

# Create a symlink from ./defaults/py_modules to the root
create_symlink: copy_deps
	mkdir -p py_modules
	ln -s $(DEPS_DEST_DIR)/* py_modules/.

# Main target to simplify the entire process
setup: create_venv install_deps copy_deps create_symlink

# Clean up the virtual environment and symlinks
clean:
	rm -rf $(VENV_NAME) $(DEPS_DEST_DIR) py_modules