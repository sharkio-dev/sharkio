echo "deleting pacakge"
rm -rf sharkio-0.1.0.tgz
echo "packing sharkio"
npm pack
echo "installing sharkio globally"
npm i -g sharkio-0.1.0.tgz