$ pybabel extract -F babel.cfg -o vpn_cmdclient.pot .
$ pybabel init --domain=vpn_cmdclient -i vpn_cmdclient.pot -d locale -l de
$ pybabel -f compile --domain=vpn_cmdclient -d locale
