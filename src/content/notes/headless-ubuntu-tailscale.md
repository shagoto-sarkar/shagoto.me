---
title: "Headless Ubuntu Server Management via Tailscale Mesh"
date: 2025-08-10
category: "infrastructure"
tags: ["Linux", "Ubuntu Server", "Tailscale", "WireGuard", "SSH", "systemd"]
---

## Philosophy of Headless Infrastructure

A headless Unix server is an exercise in computational minimalism. Eliminating display servers (X11/Wayland), desktop environments, and background telemetry liberates raw hardware cycles for compute workloads and continuous daemon operations.

In this homelab setup, a dedicated bare-metal machine running **Ubuntu Server 24.04 LTS** is orchestrated entirely through cryptographic terminal channels.

---

## Zero-Trust Tailscale WireGuard Mesh

Traditional remote access relying on dynamic DNS and forwarded router ports (e.g. port 22 exposed to the public internet) invites automated brute-force attacks.

Instead, the node is integrated into a private **Tailscale overlay mesh** powered by the WireGuard protocol:
* **No Open Firewall Ports:** Inbound firewall rules drop all unauthenticated WAN packets.
* **Peer-to-Peer Encrypted Tunnels:** Direct WireGuard encapsulation between the workstation and the headless server.
* **Stable MagicDNS Addressing:** Fixed internal resolving hostname regardless of dynamic physical ISP IP changes.

### SSH Hardening Configuration

Password authentication is completely disabled in `/etc/ssh/sshd_config.d/99-hardened.conf`:

```text
# /etc/ssh/sshd_config.d/99-hardened.conf
Port 2222
PermitRootLogin no
PasswordAuthentication no
KbdInteractiveAuthentication no
PubkeyAuthentication yes
AuthorizedKeysFile .ssh/authorized_keys
AllowUsers s_goto
X11Forwarding no
MaxAuthTries 3
```

---

## Daemon Management via systemd

Background processes (including the `aria2` RPC daemon and persistent worker containers) run as user-level `systemd` services enabled for lingering:

```bash
# Enable user lingering so daemons persist past logout
loginctl enable-linger s_goto

# User service definition: ~/.config/systemd/user/aria2.service
[Unit]
Description=Aria2 RPC Download Daemon
After=network.target

[Service]
Type=simple
ExecStart=/usr/bin/aria2c --enable-rpc --rpc-listen-all=false --rpc-listen-port=6800 --dir=/var/storage/downloads
Restart=on-failure
RestartSec=5s

[Install]
WantedBy=default.target
```

### Service Verification

*Representative systemd service status on personal homelab node:*

```text
$ ssh s_goto@node-ubuntu -p 2222 "systemctl --user status aria2"
● aria2.service - Aria2 RPC Download Daemon
     Loaded: loaded (/home/s_goto/.config/systemd/user/aria2.service; enabled)
     Active: active (running) since Wed 2025-08-10 14:22:01 UTC; 4 weeks 2 days ago
   Main PID: 1248 (aria2c)
      Tasks: 1 (limit: 18942)
     Memory: 14.2M
        CPU: 12.891s
     CGroup: /user.slice/user-1000.slice/user@1000.service/app.slice/aria2.service
             └─1248 /usr/bin/aria2c --enable-rpc ...
```

Through this architecture, the server remains an isolated, high-uptime execution node accessible with zero friction from any network.
