## FREQUENTLY ASKED QUESTIONS (FAQ)
====================================

-   Problem: Minimum number of network interfaces required to
    run Secmon.

    Secmon require at least two interfaces to run. One interface is
    required by DPDK through which secmon will receive packets and
    another Interface is required by secmon to transmit the packets
    to collector. Interface binded to DPDK is not visible to kernel so
    we can’t use it to transmit packets to collector.

-   Problem: How should I check that packets are received by Secmon.

    First make sure that DPDK is not binded to any interface. Now send
    UDP packets to interface which you want to bind to DPDK. Now run
    ***tcpdump*** command and check that you are receiving packets
    or not. If you are not receiving packets than ***ping*** the
    interface to check that if it’s reachable from the machine from
    which we you are sending UDP packets. If ping is not working than
    check your network configurations.

-   Problem: How I can check that Secmon is receiving configurations
    from EMS.

    When you run Secmon and if it’s not able to receive configurations
    from EMS than it will show Error message stating ***“Error to
    fetch url”.*** You need to check if EMS machine is reachable from
    your Secmon machine through ***ping*** command. If its reachable you
    have to check if EMS is running or not.

-   Problem: EMS is reachable but Secmon is not receiving configurations
    from EMS.

    Check if any proxy is set. Run this command ***echo $http\_proxy***
    and ***echo $https\_proxy***. If this is set than unset it by
    running command **export http\_proxy=** and
    **export https\_proxy=.**

-   Problem: Not receiving any ACK packets from interface which is
    binded to DPDK.

    You will not receive any ACK packets from the interface which is
    used by DPDK.

-   Problem: ARP is not getting resolved to interface which is binded
    to DPDK.

    You can add static ARP entry to dpdk interface. First unbind the
    interface which is binded to DPDK and run **ifconfig** command and
    note down the mac address of the interface which you want to bind to
    DPDK and then go to other machine which is sending packets to DPDK
    interface and then type **arp –s &lt;ip address&gt; &lt;mac
    address&gt;**(ip address is of DPDK interface).

-   Problem: How I can verify that Secmon is running correctly.

    While traffic is running you can check that it if you are receiving
    packets on collector machine. After that you can make some changes
    in EMS GUI and press flush and then check that these configurations
    changes are seen on collector machine.
