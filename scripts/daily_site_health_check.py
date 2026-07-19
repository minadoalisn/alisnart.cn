#!/usr/bin/env python3
"""
艾里森官网每日健康检查脚本
自动巡检中英文站，发现问题立即报告

检查项：
1. HTTP状态码
2. class_ bug
3. 图片404
4. CSS版本号
5. 百度统计代码
6. 重复图片（通过文件哈希）
7. 社交联系方式完整性
"""

import requests
from bs4 import BeautifulSoup
import hashlib
from pathlib import Path
from datetime import datetime
import json

# 配置
SITE_BASE = "https://alisnart.cn"
REPORT_DIR = Path(__file__).parent.parent / "reports" / "health_checks"
REPORT_DIR.mkdir(parents=True, exist_ok=True)

# 测试URL清单
TEST_URLS = {
    "中文首页": f"{SITE_BASE}/index.html",
    "中文案例列表": f"{SITE_BASE}/cases.html",
    "华灯树详情": f"{SITE_BASE}/cases/lantern-tree-plaza.html",
    "月下仙境详情": f"{SITE_BASE}/cases/moonlit-wonderland.html",
    "天环广场详情": f"{SITE_BASE}/cases/celestial-ring-plaza.html",
    "孔雀秋千详情": f"{SITE_BASE}/cases/han-moon-peacock-swing.html",
    "英文首页": f"{SITE_BASE}/en/",
    "英文服务": f"{SITE_BASE}/en/services.html",
    "英文方案参考": f"{SITE_BASE}/en/cases.html",
    "英文洞察": f"{SITE_BASE}/en/news.html",
}

# 必需的受控联系方式
REQUIRED_CONTACTS = [
    "www.alisnart.com",
    "facebook.com/alisnartsculpture",
    "instagram.com/vicky_alisnart",
    "linkedin.com/in/vicky",
    "15791503693",
    "26812150420",
    "94106741441",
]

# 必需百度统计ID
BAIDU_ANALYTICS_ID = "7b3e99cf8369883da4fbdc05a82a7051"

def check_page(name, url):
    """检查单个页面"""
    issues = []
    
    try:
        r = requests.get(url, timeout=10)
        
        # 检查1: HTTP状态码
        if r.status_code != 200:
            issues.append(f"❌ HTTP {r.status_code}")
            return issues
        
        html = r.text
        soup = BeautifulSoup(html, 'html.parser')
        
        # 检查2: class_ bug
        if 'class_=' in html or 'class_"' in html:
            issues.append("⚠️ 存在 class_ 属性bug")
        
        # 检查3: 图片404（抽样前5张）
        imgs = soup.find_all('img', src=True)
        broken_images = []
        for img in imgs[:5]:
            img_url = img['src']
            if img_url.startswith('http'):
                full_url = img_url
            elif img_url.startswith('/'):
                full_url = f"{SITE_BASE}{img_url}"
            else:
                base = url.rsplit('/', 1)[0]
                full_url = f"{base}/{img_url}"
            
            try:
                img_r = requests.head(full_url, timeout=5)
                if img_r.status_code != 200:
                    broken_images.append(img_url)
            except:
                pass
        
        if broken_images:
            issues.append(f"⚠️ 图片404: {', '.join(broken_images[:2])}")
        
        # 检查4: CSS版本号
        css_links = soup.find_all('link', rel='stylesheet')
        css_versions = []
        for css in css_links:
            href = css.get('href', '')
            if 'site.css' in href:
                if '?v=' not in href:
                    issues.append("⚠️ CSS缺少版本号")
                else:
                    import re
                    match = re.search(r'\?v=(\d+)', href)
                    if match:
                        css_versions.append(int(match.group(1)))
        
        # 检查5: 百度统计代码（仅中文站）
        if not url.startswith(f"{SITE_BASE}/en/"):
            if BAIDU_ANALYTICS_ID not in html and "assets/js/site.js" not in html:
                issues.append("⚠️ 缺少百度统计")
        
        # 检查6: 社交联系方式（仅英文站）
        if url.startswith(f"{SITE_BASE}/en/"):
            missing_contacts = [c for c in REQUIRED_CONTACTS if c not in html]
            if missing_contacts:
                issues.append(f"⚠️ 缺少联系方式: {', '.join(missing_contacts)}")
        
        # 如果没问题，返回OK
        if not issues:
            issues.append("✓ 正常")
        
    except Exception as e:
        issues.append(f"❌ 请求失败: {str(e)[:50]}")
    
    return issues

def check_duplicate_images():
    """检查重复图片（本地文件哈希对比）"""
    image_dir = Path(r"D:\艾里森官网")
    
    # 关键图片路径
    images_to_check = {
        "华灯树列表": image_dir / "cases-images" / "lantern-tree-plaza.webp",
        "华灯树详情": image_dir / "cases" / "images" / "lantern-tree-plaza.webp",
        "月下仙境列表": image_dir / "cases-images" / "moonlit-wonderland.webp",
        "月下仙境详情": image_dir / "cases" / "images" / "moonlit-wonderland.webp",
        "天环广场列表": image_dir / "cases-images" / "celestial-ring-plaza.webp",
        "天环广场详情": image_dir / "cases" / "images" / "celestial-ring-plaza.webp",
        "孔雀秋千列表": image_dir / "cases-images" / "han-moon-peacock-swing.webp",
        "孔雀秋千详情": image_dir / "cases" / "images" / "han-moon-peacock-swing.webp",
    }
    
    hashes = {}
    duplicates = []
    
    for name, path in images_to_check.items():
        if not path.exists():
            continue
        
        file_hash = hashlib.md5(path.read_bytes()).hexdigest()
        
        if file_hash in hashes:
            duplicates.append(f"⚠️ {name} 与 {hashes[file_hash]} 内容相同（重复）")
        else:
            hashes[file_hash] = name
    
    return duplicates

def main():
    """执行每日健康检查"""
    print("=== 艾里森官网每日健康检查 ===")
    print(f"时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
    
    all_issues = []
    
    # 检查所有页面
    for name, url in TEST_URLS.items():
        print(f"检查: {name}")
        issues = check_page(name, url)
        for issue in issues:
            print(f"  {issue}")
            if "❌" in issue or "⚠️" in issue:
                all_issues.append(f"{name}: {issue}")
        print()
    
    # 检查重复图片
    print("检查重复图片...")
    duplicates = check_duplicate_images()
    if duplicates:
        for dup in duplicates:
            print(f"  {dup}")
            all_issues.extend(duplicates)
    else:
        print("  ✓ 无重复图片")
    
    # 生成报告
    report = {
        "timestamp": datetime.now().isoformat(),
        "total_issues": len(all_issues),
        "issues": all_issues
    }
    
    report_file = REPORT_DIR / f"health_check_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    report_file.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
    
    print(f"\n{'='*50}")
    print(f"检查完成: 发现 {len(all_issues)} 个问题")
    print(f"报告已保存: {report_file}")
    
    if all_issues:
        print("\n【需要修复的问题】:")
        for issue in all_issues[:10]:  # 只显示前10个
            print(f"  • {issue}")
    else:
        print("\n✓ 网站健康状态良好，无需修复")
    
    return len(all_issues)

if __name__ == "__main__":
    exit_code = main()
    exit(0 if exit_code == 0 else 1)
