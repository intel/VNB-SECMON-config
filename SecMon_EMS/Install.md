# **SecMon EMS Setup Steps**
========================

## Install Dependencies
--------------------

1.  Install packages used by SecMon EMS server. Like *Django Framework, python-consul and Django Rest Framework.*
    `apt-get -y update`
    `apt-get -y --force-yes install python-pip`
    `pip install Django==1.8.1`
    `apt-get -y --force-yes install python-yapsy`
    `pip install python-consul`
    `pip install djangorestframework==2.3.12`

2.  Fetch **consul** distributed database binary from hashicorp website.
    `cd <repo_name>/SecMonEMS/`
    `wget --no-check-certificate https://releases.hashicorp.com/consul/0.7.0/consul_0.7.0_linux_amd64.zip`
    `unzip consul_0.7.0_linux_amd64.zip`
    `rm consul_0.7.0_linux_amd64.zip`

3.  Create folder to store **consul** database files.
    `cd <repo_name>/SecMonEMS/`
    `mkdir -p consul_data`

4.  Change log file permissions.
```
    sudo chmod 777 SecMonEMS/configagent.log
```

5.  Install Apache web server and Apache wsgi module.
```
    sudo -E apt-get -y install apache2 libapache2-mod-wsgi
```

6.  Configure SSL related Apache configurations.
```
    project_dir=<repo_name>/SecMonEMS
    sudo cp SecMonEMS/apache_configurations/apache2.conf /etc/apache2/apache2.conf
    sudo sed -i -e 's-${PROJECT_ROOT}-'"$project_dir"'-g' /etc/apache2/apache2.conf
    sudo cp SecMonEMS/apache_configurations/default-ssl.conf /etc/apache2/sites-available/default-ssl.conf
    sudo sed -i -e 's-${PROJECT_ROOT}-'"$project_dir"'-g' /etc/apache2/sites-available/default-ssl.conf
    sudo sed -i -e 's-${CERT_PATH}-'"$cert_path"'-g' /etc/apache2/sites-available/default-ssl.conf
```

7. Configure HTTP related configurations for Apache web server.
```
    sudo cp SecMonEMS/apache_configurations/000-default.conf /etc/apache2/sites-available/000-default.conf
    sudo sed -i -e 's-${PROJECT_ROOT}-'"$project_dir"'-g' /etc/apache2/sites-available/000-default.conf
```

8. Enable Apache web server.
```
   sudo a2enmod wsgi
   sudo a2enmod ssl
   sudo a2ensite default-ssl
   sudo service apache2 restart
```


## Run SecMon EMS Server
---------------------

1.  Start **consul** database server in bootstrap mode in background.
    `cd <repo_name>/SecMonEMS/`
    `nohup ./consul agent -server -bootstrap -data-dir consul_data
    -advertise=127.0.0.1 &`

2.  Start **EMS Notifier** service in background.
    `cd <repo_name>/SecMonEMS/SecMonEMS`
    `nohup python ./manage.py emsnotify &`


