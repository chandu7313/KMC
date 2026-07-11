# KMC Deployment Guide

This guide explains how to deploy Kissan Mithar Consultancy (KMC) on AWS EC2.

## Prerequisites
- AWS EC2 instance running Ubuntu
- Docker and Docker Compose installed
- Domain (`kissanmithar.com`) pointing to the EC2 Elastic IP
- Ports 80 and 443 open on AWS Security Group

## Deployment Pipeline
We have configured GitHub Actions (`.github/workflows/deploy.yml`) to handle automated deployment to the EC2 instance whenever code is pushed to `main`.

### Manual Deployment
If you need to deploy manually:

1. SSH into the server.
2. Navigate to the project root: `cd ~/kissan`
3. Execute the deploy script: `./scripts/deploy.sh`

The script will pull the latest code, build the multi-stage optimized Docker images, and spin up the containers with zero downtime.

## Environment Variables
Ensure all environment variables inside `microservices/.env` are correctly set. This `.env` file replaces the scattered `.env` files and securely injects them into the Docker containers at runtime. **Never commit `.env` to GitHub.**
