import re

with open('docker-compose.yml', 'r') as f:
    content = f.read()

# Pattern to match the specific 4 lines of volumes in each service
pattern = re.compile(r'    volumes:\n      - \./services/[^/]+/src:/app/services/[^/]+/src\n      - /app/node_modules\n      - \./packages:/app/packages\n      - \./logs/[^/]+:/app/logs\n')
new_content = pattern.sub('', content)

# Also remove for frontend:
front_pattern = re.compile(r'    volumes:\n      - \./frontend/web:/app\n      - /app/node_modules\n')
new_content = front_pattern.sub('', new_content)

with open('docker-compose.yml', 'w') as f:
    f.write(new_content)

print("Updated docker-compose.yml")
