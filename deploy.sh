# Cleanup the build directory
rm -rf build
mkdir -p build
# Build the app
npm run build
# Copy git context to the build directory
cp -R .git build/.git 
# Get into the build directory
pushd build
# Add and commit changes
git add . 
git commit -am \"Publishing...\" 
# Push the current branch to gh-pages branch.
# remote can be changed with REMOTE environment var ("origin" by default).
git push -u ${REMOTE:-origin} master:gh-pages --force
# Get out of the build directory
popd
# Cleanup the build directory
rm -rf build
mkdir -p build
