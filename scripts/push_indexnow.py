#!/usr/bin/env python3
"""
IndexNow批量推送脚本
快速通知Bing/Yandex索引新改造的GEO页面
"""

import requests
import json
from datetime import datetime

# IndexNow配置
API_ENDPOINT = "https://api.indexnow.org/indexnow"
HOST = "alisnart.cn"
KEY = "7b3e99cf8369883da4fbdc05a82a7051"  # 使用百度统计ID作为验证密钥
KEY_LOCATION = f"https://{HOST}/{KEY}.txt"

# 改造后的GEO页面列表
UPDATED_URLS = [
    f"https://{HOST}/cases/lantern-tree-plaza.html",
    f"https://{HOST}/cases/celestial-ring-plaza.html",
    f"https://{HOST}/cases/moonlit-wonderland.html",
    f"https://{HOST}/cases/han-moon-peacock-swing.html",
    f"https://{HOST}/cases.html",  # 列表页也一起推送
]

def push_indexnow():
    """推送IndexNow"""
    payload = {
        "host": HOST,
        "key": KEY,
        "keyLocation": KEY_LOCATION,
        "urlList": UPDATED_URLS
    }
    
    print("=== IndexNow批量推送 ===")
    print(f"时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"域名: {HOST}")
    print(f"URL数量: {len(UPDATED_URLS)}\n")
    
    try:
        response = requests.post(
            API_ENDPOINT,
            headers={"Content-Type": "application/json"},
            data=json.dumps(payload),
            timeout=30
        )
        
        print(f"状态码: {response.status_code}")
        
        if response.status_code == 200:
            print("✓ 推送成功！Bing和Yandex将在24小时内抓取")
            print("\n推送的URL:")
            for i, url in enumerate(UPDATED_URLS, 1):
                print(f"  {i}. {url}")
            return True
        elif response.status_code == 202:
            print("✓ 推送已接受，等待处理")
            return True
        else:
            print(f"❌ 推送失败: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ 请求失败: {e}")
        return False

def create_key_file():
    """生成IndexNow验证密钥文件"""
    key_content = KEY
    key_file_path = f"D:\\艾里森官网\\{KEY}.txt"
    
    with open(key_file_path, 'w') as f:
        f.write(key_content)
    
    print(f"\n✓ 验证密钥文件已生成: {key_file_path}")
    print(f"请上传到服务器根目录: /usr/share/nginx/html/{KEY}.txt")
    return key_file_path

if __name__ == "__main__":
    # 生成密钥文件
    key_file = create_key_file()
    
    # 推送IndexNow
    success = push_indexnow()
    
    if success:
        print("\n【下一步】")
        print("1. 上传密钥文件到服务器")
        print(f"2. 验证: curl https://{HOST}/{KEY}.txt")
        print("3. 24小时后在Bing/Yandex搜索 'site:alisnart.cn 华灯树广场'")
    
    exit(0 if success else 1)
