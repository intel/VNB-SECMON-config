#!/bin/bash

# Setup script for SecMon

current_dir=`pwd`/..

function install_dep {
  cd $current_dir
  echo "Installing dependencies..."
  apt-get -y --force-yes install build-essential
  apt-get -y --force-yes install make
  apt-get -y --force-yes install libcurl4-openssl-dev
  apt-get -y --force-yes install curl libcurl3 php5-curl
  apt-get -y --force-yes install libjson0 libjson0-dev

  echo "fetching DPDK source..."
  wget http://dpdk.org/browse/dpdk/snapshot/dpdk-2.0.0.tar.gz
  echo "fetching DPDK source...done"

  echo "Building DPDK..."
  tar -xvzf dpdk-2.0.0.tar.gz
  rm dpdk-2.0.0.tar.gz
  cp -r `pwd`/dpdk-2.0.0 /etc/
  cd /etc/dpdk-2.0.0 && make config T=x86_64-native-linuxapp-gcc && make install T=x86_64-native-linuxapp-gcc
  echo "Building DPDK...done"
	
  echo "Inserting IGB UIO driver..."
  modprobe uio
  insmod /etc/dpdk-2.0.0/x86_64-native-linuxapp-gcc/kmod/igb_uio.ko
  echo "Inserting IGB UIO driver...done"
  
  echo "Installing dependencies...done"
}

function configure_hugepages {
  echo "freeing caches..."
  sync; echo 3 > /proc/sys/vm/drop_caches
  sync; echo 2 > /proc/sys/vm/drop_caches
  sync; echo 1 > /proc/sys/vm/drop_caches
  echo "freeing caches...done"

  echo "Adding hugepages..."
  sysctl vm.nr_hugepages=600
  mkdir -p /mnt/huge
  mount -t hugetlbfs dev /mnt/huge
  echo "Adding hugepages...done"
}


function build_secmon {
  cd $current_dir
  CURR_DIR=`pwd`
  SEC_AGENT=$CURR_DIR/secmon_agent
  export RTE_SDK=/etc/dpdk-2.0.0
  mkdir -p /opt/secmon/plugins/config

  # compile secmon agent
  echo "Compiling secmon agent..."
  cd $SEC_AGENT
  make clean; make
  echo "Compiling secmon agent... done"

  # compile secmon plugins
  echo "Compiling secmon plugins..."
  SEC_PLUGIN=$CURR_DIR/secmon_plugin
  RAW_PLUGIN=$SEC_PLUGIN/rawforward_plugin
  NET_PLUGIN=$SEC_PLUGIN/netflow_plugin

  cd $RAW_PLUGIN && make clean; make
  cd $NET_PLUGIN && make clean; make

  # copy plugins to standard path
  cd $RAW_PLUGIN && cp build/*.so /opt/secmon/plugins
  cd $NET_PLUGIN && cp build/*.so /opt/secmon/plugins
  echo "Compiling secmon plugins... done"
}

function configure_secmon {
  cd $current_dir
  echo "Configuring hugepages..."
  configure_hugepages
  echo "Configuring hugepages...done"

  echo "Configuring SecMon..."
  cp config/* /opt/secmon/plugins/config/

  echo -n "SecMon egress interface: "
  read egress_intf
  echo "" > /opt/secmon/plugins/config/conf_params.cfg
  echo $egress_intf > /opt/secmon/plugins/config/conf_params.cfg

  echo -n "SecMon plugin server IP: "
  read server_ip

  echo -n "SecMon rawforward plugin server port: "
  read raw_server_port

  echo "" > /opt/secmon/plugins/config/rawforward_server.ini
  echo "[Server Ip]:$server_ip" > /opt/secmon/plugins/config/rawforward_server.ini
  echo "[Server Port]:$raw_server_port" >> /opt/secmon/plugins/config/rawforward_server.ini

  echo -n "SecMon netflow plugin server port: "
  read net_server_port

  echo "" > /opt/secmon/plugins/config/netflow_server.ini
  echo "[Server Ip]:$server_ip" > /opt/secmon/plugins/config/netflow_server.ini
  echo "[Server Port]:$net_server_port" >> /opt/secmon/plugins/config/netflow_server.ini

  echo -n "EMS server IP: "
  read ems_server_ip
  echo -n "EMS server port: "
  read ems_server_port
  echo -n "EMS server scope: "
  read scope

  echo "" > /opt/secmon/plugins/config/EMS_config.ini
  echo "[Server Ip]:$ems_server_ip" > /opt/secmon/plugins/config/EMS_config.ini
  echo "[Server Port]:$ems_server_port" >> /opt/secmon/plugins/config/EMS_config.ini
  echo "[scope]:$scope" >> /opt/secmon/plugins/config/EMS_config.ini

  echo -n "Interface to be bound to DPDK: "
  read dpdk_intf
  echo "" > /opt/secmon/plugins/config/SecMonAgent_Config.ini
  echo $dpdk_intf > /opt/secmon/plugins/config/SecMonAgent_Config.ini
  echo "Configuring SecMon... done"
}

function run_secmon {
  cd $current_dir
  echo "Binding DPDK port"
  interface=`cat /opt/secmon/plugins/config/SecMonAgent_Config.ini`
  PCI=`ethtool -i $interface | grep bus-info | cut -c16-`
  ifconfig $interface down
  /etc/dpdk-2.0.0/tools/dpdk_nic_bind.py -b igb_uio $PCI
  echo "Binding DPDK port...done"

  echo "Running SecMon..."
  export LD_LIBRARY_PATH=/opt/secmon/plugins
  cd secmon_agent/build/
  secmon_start_string="./SecMonAgent -c 0x3 -n 4 -m 256"
  blacklist_string=" -b "
  secmon_end_string=" -- -p 0x1"    
  PCI_LIST=`/etc/dpdk-2.0.0/tools/dpdk_nic_bind.py --status | grep "if=" | cut -c-12`
  i=0
  for pci in $PCI_LIST
  do
  if [ $i -ge 0 ]
  then
  secmon_start_string=$secmon_start_string$blacklist_string
  secmon_start_string=$secmon_start_string$pci
  fi
  i=`expr $i + 1`
  done
  secmon_start_string=$secmon_start_string$secmon_end_string
  nohup $secmon_start_string &
  echo "Running SecMon...done"

  echo 
}

# loop for user input
while true; do
  echo "Choose operation you want to perfrom"
  echo "1.  Install Dependencies"
  echo "2.  Build SecMon"
  echo "3.  Configure SecMon"
  echo "4.  Run SecMon"
  echo

  echo -n "Enter you choice, or 0 for exit: "
  read choice
  echo 

  case $choice in
    1) 
      install_dep
      ;;
    2)   
      build_secmon
      ;;
    3)
      configure_secmon
      ;;
    4)
      run_secmon
      ;;
    0)
      echo "exiting.... bye"
      break
      ;;
    *)
      echo "Invalid choice, try a number from 0 to 4"
      ;;
esac
done
