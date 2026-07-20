#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
百度搜索资源平台链接自动推送脚本
使用百度准入密钥自动推送网站链接
"""

import requests
import json
import os
from datetime import datetime

# 百度推送配置
BAIDU_PUSH_URL = "http://data.zz.baidu.com/urls"
SITE = "alisnart.cn"
TOKEN = os.environ.get("BAIDU_PUSH_TOKEN", "").strip()

# 需要推送的URL列表
URLS_TO_PUSH = [
    "https://alisnart.cn/",
    "https://alisnart.cn/index.html",
    "https://alisnart.cn/ai-answer-hub.html",
    "https://alisnart.cn/geo-promotion.html",
    "https://alisnart.cn/light-designer.html",
    "https://alisnart.cn/services.html",
    "https://alisnart.cn/cases.html",
    "https://alisnart.cn/solutions/outdoor-light-art-installation-geo.html",
    "https://alisnart.cn/solutions/ancient-town-lantern-route.html",
    "https://alisnart.cn/solutions/tidal-light-corridor.html",
    "https://alisnart.cn/solutions/lake-floating-stage-light-show.html",
    "https://alisnart.cn/solutions/scenic-cloud-ring-photo-spot.html",
    "https://alisnart.cn/sitemap.xml",
    "https://alisnart.cn/robots.txt",
    "https://alisnart.cn/llms.txt",
    "https://alisnart.cn/ai-search-ready.txt",
    "https://alisnart.cn/geo-feed.json"
]

def push_urls_to_baidu():
    """推送URL到百度搜索资源平台"""

    if not TOKEN:
        print("❌ 缺少 BAIDU_PUSH_TOKEN 环境变量，已停止推送。")
        return False
    
    print("=" * 60)
    print("百度搜索资源平台 - 链接自动推送")
    print("=" * 60)
    print(f"站点: {SITE}")
    print(f"推送时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"待推送URL数量: {len(URLS_TO_PUSH)}")
    print("-" * 60)
    
    # 构建推送URL
    push_url = f"{BAIDU_PUSH_URL}?site={SITE}&token={TOKEN}"
    
    # 准备数据（每行一个URL）
    data = "\n".join(URLS_TO_PUSH)
    
    print("\n📤 正在推送URL到百度...")
    
    try:
        # 发送POST请求
        headers = {
            "Content-Type": "text/plain"
        }
        
        response = requests.post(push_url, data=data, headers=headers, timeout=30)
        
        print(f"\n📡 响应状态码: {response.status_code}")
        
        if response.status_code == 200:
            # 解析响应
            result = response.json()
            
            print("\n✅ 推送成功！")
            print(f"   成功推送: {result.get('success', 0)} 条")
            print(f"   今日剩余: {result.get('remain', 0)} 条")
            
            if result.get('not_same_site'):
                print(f"\n⚠️  非本站URL（未处理）: {len(result['not_same_site'])} 条")
                for url in result['not_same_site']:
                    print(f"   - {url}")
            
            if result.get('not_valid'):
                print(f"\n⚠️  不合法URL: {len(result['not_valid'])} 条")
                for url in result['not_valid']:
                    print(f"   - {url}")
            
            # 保存推送记录
            save_push_record(result)
            
            return True
        else:
            print(f"\n❌ 推送失败！")
            print(f"   响应内容: {response.text}")
            return False
            
    except requests.exceptions.Timeout:
        print("\n❌ 推送超时！请稍后重试。")
        return False
    except requests.exceptions.RequestException as e:
        print(f"\n❌ 推送出错: {e}")
        return False
    except json.JSONDecodeError:
        print(f"\n❌ 响应解析失败！")
        print(f"   响应内容: {response.text}")
        return False

def save_push_record(result):
    """保存推送记录到文件"""
    
    record_file = "baidu_push_log.json"
    
    try:
        # 读取现有记录
        try:
            with open(record_file, 'r', encoding='utf-8') as f:
                records = json.load(f)
        except FileNotFoundError:
            records = []
        
        # 添加新记录
        new_record = {
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "success": result.get("success", 0),
            "remain": result.get("remain", 0),
            "not_same_site": result.get("not_same_site", []),
            "not_valid": result.get("not_valid", [])
        }
        
        records.insert(0, new_record)
        
        # 只保留最近100条记录
        if len(records) > 100:
            records = records[:100]
        
        # 保存
        with open(record_file, 'w', encoding='utf-8') as f:
            json.dump(records, f, ensure_ascii=False, indent=2)
        
        print(f"\n💾 推送记录已保存到: {record_file}")
        
    except Exception as e:
        print(f"\n⚠️  保存记录失败: {e}")

def main():
    """主函数"""
    success = push_urls_to_baidu()
    
    print("\n" + "=" * 60)
    if success:
        print("🎉 推送完成！")
    else:
        print("❌ 推送失败，请稍后重试。")
    print("=" * 60)
    
    return 0 if success else 1

if __name__ == "__main__":
    exit(main())
