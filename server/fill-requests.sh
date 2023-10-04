for i in {1..10}; do
  curl --silent localhost:5012/asdf  -H 'Content-Type: application/json' -d '{"login":"my_login","password":"my_password"}' > /dev/null
  curl --silent -X POST localhost:5012/asdf > /dev/null
  curl --silent -X PATCH localhost:5012/asdf > /dev/null
  echo "invoked ${i}"
done