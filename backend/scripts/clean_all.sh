#!/bin/bash
# Nabyl Bennouri - 1/16/2018

# test
echo "1/2 - Removing .zip artifacts"
rm -rf *.zip
echo "2/2 - Removing functions imported node modules"
find . -name node_modules -exec rm -rf {} \;
echo "Successfully cleaned all artifacts. You are ready to commit the code."
