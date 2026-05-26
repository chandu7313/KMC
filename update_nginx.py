import os
import re

conf_path = 'microservices/nginx/conf.d/kissan-mithar.conf'
with open(conf_path, 'r') as f:
    text = f.read()

text = text.replace('server {\n  listen 80;', 'server {\n  listen 80;\n  resolver 127.0.0.11 valid=10s ipv6=off;\n')

text = text.replace('proxy_pass http://auth_upstream/farmer/send-otp;', 'set $backend http://auth-service:3001;\n    rewrite ^/api/auth/(.*) /$1 break;\n    proxy_pass $backend;')
text = text.replace('proxy_pass http://auth_upstream/dev-login;', 'set $backend http://auth-service:3001;\n    rewrite ^/api/auth/(.*) /$1 break;\n    proxy_pass $backend;')
text = text.replace('proxy_pass http://auth_upstream/;', 'set $backend http://auth-service:3001;\n    rewrite ^/api/auth/(.*) /$1 break;\n    proxy_pass $backend;')
text = text.replace('proxy_pass http://user_upstream/;', 'set $backend http://user-service:3002;\n    rewrite ^/api/users/(.*) /$1 break;\n    proxy_pass $backend;')
text = text.replace('proxy_pass http://user_upstream;', 'set $backend http://user-service:3002;\n    proxy_pass $backend;')
text = text.replace('proxy_pass http://ai_upstream;', 'set $backend http://ai-service:3003;\n    proxy_pass $backend;')
text = text.replace('proxy_pass http://disease_upstream/;', 'set $backend http://disease-service:3004;\n    rewrite ^/api/disease/(.*) /$1 break;\n    proxy_pass $backend;')
text = text.replace('proxy_pass http://soil_upstream/;', 'set $backend http://soil-service:3005;\n    rewrite ^/api/soil/(.*) /$1 break;\n    proxy_pass $backend;')
text = text.replace('proxy_pass http://market_upstream/;', 'set $backend http://market-service:3006;\n    rewrite ^/api/market/(.*) /$1 break;\n    proxy_pass $backend;')
text = text.replace('proxy_pass http://ecommerce_upstream;', 'set $backend http://ecommerce-service:3007;\n    proxy_pass $backend;')
text = text.replace('proxy_pass http://order_upstream/;', 'set $backend http://order-service:3008;\n    rewrite ^/api/orders/(.*) /$1 break;\n    proxy_pass $backend;')
text = text.replace('proxy_pass http://payment_upstream/;', 'set $backend http://payment-service:3009;\n    rewrite ^/api/payments/(.*) /$1 break;\n    proxy_pass $backend;')
text = text.replace('proxy_pass http://payment_upstream;', 'set $backend http://payment-service:3009;\n    proxy_pass $backend;')
text = text.replace('proxy_pass http://notification_upstream/;', 'set $backend http://notification-service:3010;\n    rewrite ^/api/notify/(.*) /$1 break;\n    proxy_pass $backend;')
text = text.replace('proxy_pass http://support_upstream/;', 'set $backend http://support-service:3011;\n    rewrite ^/api/support/(.*) /$1 break;\n    proxy_pass $backend;')
text = text.replace('proxy_pass http://expert_upstream/;', 'set $backend http://expert-service:3012;\n    rewrite ^/api/experts/(.*) /$1 break;\n    proxy_pass $backend;')
text = text.replace('proxy_pass http://expert_upstream;', 'set $backend http://expert-service:3012;\n    proxy_pass $backend;')
text = text.replace('proxy_pass http://content_upstream/;', 'set $backend http://content-service:3013;\n    rewrite ^/api/content/(.*) /$1 break;\n    proxy_pass $backend;')
text = text.replace('proxy_pass http://content_upstream;', 'set $backend http://content-service:3013;\n    proxy_pass $backend;')
text = text.replace('proxy_pass http://analytics_upstream/;', 'set $backend http://analytics-service:3014;\n    rewrite ^/api/analytics/(.*) /$1 break;\n    proxy_pass $backend;')
text = text.replace('proxy_pass http://field_upstream/;', 'set $backend http://field-service:3015;\n    rewrite ^/api/field/(.*) /$1 break;\n    proxy_pass $backend;')
text = text.replace('proxy_pass http://frontend_upstream;', 'set $backend http://frontend:3000;\n    proxy_pass $backend;')

with open(conf_path, 'w') as f:
    f.write(text)
