#!/bin/bash

current_dir=`pwd`/..
cert_path="/etc/apache2/ssl"

function install_dep {
	cd $current_dir
    	sudo -E apt-get -y update

	echo "Installing required linux packages..."
    	# Install dependencies for SecMon EMS server
    	sudo -E apt-get -y --force-yes install python-pip 
    	sudo -E apt-get -y --force-yes install python-yapsy 
	echo "Installing required linux packages...done"

	echo "Installing required python packages..."	
    	sudo -E pip install Django==1.8.1 
    	sudo -E pip install python-consul 
    	sudo -E pip install djangorestframework==2.3.12 
    	sudo -E pip install yapsy
	echo "Installing required python packages...done"	

	echo "Fetching consul database exectuable..."    
    	wget --no-check-certificate https://releases.hashicorp.com/consul/0.7.0/consul_0.7.0_linux_amd64.zip
    	unzip consul_0.7.0_linux_amd64.zip
    	rm consul_0.7.0_linux_amd64.zip
	echo "Fetching consul database exectuable...done"

	echo "Creating directories for consul database..."	
    	mkdir -p consul_data
	echo "Creating directories for consul database...done"

    	# Change file permissions of log file
    	sudo chmod 777 SecMonEMS/configagent.log

	# changes for HTTPS communication
	# installing apache2 and mod wsgi module
	echo "Installing apache2..."
	sudo -E apt-get -y install apache2 libapache2-mod-wsgi
	echo "Installing apache2...done"

	# configuring SSL related configurations
    	# Change apache2.conf
    	project_dir=$current_dir/SecMonEMS
    	sudo cp SecMonEMS/apache_configurations/apache2.conf /etc/apache2/apache2.conf
    	sudo sed -i -e 's-${PROJECT_ROOT}-'"$project_dir"'-g' /etc/apache2/apache2.conf

    	# move default-ssl to standard path
    	sudo cp SecMonEMS/apache_configurations/default-ssl.conf /etc/apache2/sites-available/default-ssl.conf

    	# change current directory inside default-ssl file
    	sudo sed -i -e 's-${PROJECT_ROOT}-'"$project_dir"'-g' /etc/apache2/sites-available/default-ssl.conf

    	# change certificate path inside default-ssl file
    	sudo sed -i -e 's-${CERT_PATH}-'"$cert_path"'-g' /etc/apache2/sites-available/default-ssl.conf

    	# configuring HTTP related confs
    	sudo cp SecMonEMS/apache_configurations/000-default.conf /etc/apache2/sites-available/000-default.conf

    	# change current directory inside 000-default file
    	sudo sed -i -e 's-${PROJECT_ROOT}-'"$project_dir"'-g' /etc/apache2/sites-available/000-default.conf

    	# Enable apache wsgi module
    	sudo a2enmod wsgi

    	# Enable apache SSL module
    	sudo a2enmod ssl

    	# Enable SSL configurations
    	sudo a2ensite default-ssl

    	sudo service apache2 restart
}


function run_secmonems {
    	echo "Running SecMon EMS server Services..."
    	cd $current_dir
    	nohup ./consul agent -server -bootstrap -data-dir consul_data -advertise=127.0.0.1 &
    	cd SecMonEMS/
    	nohup python ./manage.py emsnotify &
    	sleep 2
    	echo "Running SecMon EMS server Services...done"
}


# loop for user input
while true; do
  	echo "Choose operation you want to perfrom"
  	echo "1.  Install Dependencies"
  	echo "2.  Run SecMon EMS"
  	echo

  	echo -n "Enter you choice, or 0 for exit: "
  	read choice
  	echo 

  	case $choice in
  	  1) 
  	    install_dep
  	    ;;
  	  2)   
  	    run_secmonems
  	    ;;
  	  0)
  	    echo "exiting.... bye"
  	    break
  	    ;;
  	  *)
  	    echo "Invalid choice, try a number from 0 to 2"
  	    ;;
esac
done
