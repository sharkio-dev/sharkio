echo "deleting pacakge"
rm -rf tartigraid-0.1.0.tgz
echo "packing tartigraid"
npm pack
echo "installing tartigraid globally"
npm i -g tartigraid-0.1.0.tgz