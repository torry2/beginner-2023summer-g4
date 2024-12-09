#!/bin/bash

# Adapted from: https://forums.docker.com/t/restricting-external-container-access-with-iptables/2225/2
# Create a PRE_DOCKER table
iptables -N PRE_DOCKER

# Default action
iptables -I PRE_DOCKER -j DROP

# Docker Containers Public access
for i in `curl https://www.cloudflare.com/ips-v4`; do iptables -I PRE_DOCKER -i eth0 -s $i -j ACCEPT; done

# Docker internal use
iptables -I PRE_DOCKER -o docker0 -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT
iptables -I PRE_DOCKER -i docker0 ! -o docker0 -j ACCEPT
iptables -I PRE_DOCKER -m state --state RELATED -j ACCEPT
iptables -I PRE_DOCKER -i docker0 -o docker0 -j ACCEPT

# Finally insert the PRE_DOCKER table before the DOCKER table in the FORWARD chain.
iptables -I FORWARD -o docker0 -j PRE_DOCKER

netfilter-persistent save